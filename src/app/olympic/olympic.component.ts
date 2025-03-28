import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../core/services/olympic.service';
import { Olympic } from '../core/models/Olympic';
import { Subject, take, takeUntil } from 'rxjs';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Countrydetails } from '../core/models/CountryDetails';
import { Router } from '@angular/router';
import { EventData } from '../core/models/EventData';
import { Tooltip } from '../core/models/Tooltip';


@Component({
    selector: 'app-olympic',
    templateUrl: './olympic.component.html',
    styleUrl: './olympic.component.scss',
    standalone: false
})

export class OlympicComponent implements OnInit {

  olympics: Olympic[] = [];
  loading: boolean = false;
  error: string = '';
  legendPosition: LegendPosition = LegendPosition.Below;
  tooltipPosition: { top: number, left: number } | null = null;
  tooltipVisible = false;
  tooltipData: Tooltip | null = null;
  private unsubscribe$ = new Subject<void>();  

  // Tableau ayant pour résultat les données traitées et récupérées
  chartData: Countrydetails[] = [];

  // Fonction pour traiter les données
  countryMedalsData(): void {
    this.chartData = this.olympics.map(country => {
      const totalMedals = country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
      return { name: country.country, value: totalMedals, extra: {id: country.id} };
    });
    // console.log("Nombre de medails par pays:", this.chartData);
    this.chartData = this.chartData.filter(country => !isNaN(country.value));

  }

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.olympicService.getLoadingState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loading) => {
        this.loading = loading;  // Met à jour l'état de chargement
    });
    
    this.olympicService.getErrorState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((error) => {
        this.error = error;  // Met à jour le message d'erreur
    });

    this.olympicService!.loadInitialData()
      .pipe(take(1))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.olympics = data ;
          // console.log('affiche la donnée:', this.olympics)
          this.countryMedalsData();
        }
      );
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  // Capture la position du tooltip
  onActivate(event: EventData): void {
    this.tooltipVisible = true;
    this.tooltipData = event.series;
    // console.log('event:', event)

    // Vérifie la structure de l'objet `event` et récupère les coordonnées correctement
    if (event && event.entries && event.entries.length > 0) {
      const item = event.entries[0];  
      this.tooltipData = item; 
    }
  
    // Récupère la position de l'événement pour le tooltip
    if (event && event.event) {
      this.tooltipPosition = {
        top: event.event.offsetY,
        left: event.event.offsetX
      };
    }
  }

  // Cacher le tooltip lorsqu'on quitte l'élément
  onDeactivate(): void {
    this.tooltipVisible = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.tooltipVisible) {
      this.tooltipPosition = {
        top: event.clientY - 70,
        left: event.clientX - 40 
      };
    }
  }

  onClickCountry(event: { name: string; value: number; extra: { id: number } }): void {
    // console.log("Événement sélectionné :", event);
    if (event && event.extra && event.extra.id) {
      this.router.navigateByUrl(`/country/${event.extra.id}`);
    } else {
      throw new Error("ID du pays non défini")
    }
  }
}


