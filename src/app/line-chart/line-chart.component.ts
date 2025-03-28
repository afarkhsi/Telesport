import { Component, HostListener, OnInit } from '@angular/core';
import { Participation } from '../core/models/Participation';
import { ActivatedRoute} from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Olympic } from '../core/models/Olympic';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  standalone: false,
})

export class LineChartComponent implements OnInit {
  view: [number, number] = [800, 400];
  loading: boolean = false;
  error: string = '';
  olympic$: Olympic[] = [];
  countryData : Partial <Participation>[] = []
  olympicId: number | null = null;
  isLoading = false;
  private unsubscribe$ = new Subject<void>(); 
  animationState = 'inactive'; 

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute,
  ) {}

    // Tableau ayant pour résultat les données traitées et récupérées
  chartData: Partial <Participation>[] = [];

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: 'ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

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

    // console.log('ngOnInit - Chargement des données...');
    this.loadOlympicDataById();
  }
  
  // Desabonnement aux subscribe pour eviter les fuites de mémoire
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadOlympicDataById() {
    this.isLoading = true;
  
    // Charge les données depuis le service
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          // On recupère l'ID depuis notre url
          this.olympicId = +this.route.snapshot.params['id'];
          // console.log("ID de l'url:", this.olympicId);
    
          const olympic = this.olympicService.getOlympicById(this.olympicId);
    
          if (!olympic) {
            console.error(`Pas de données à cet id: ${this.olympicId}`);
            this.isLoading = false;
          }
    
          this.olympic$ = olympic ? [olympic] : [];
          // console.log("this olympic country:", this.olympic$[0].country);
          this.isLoading = false;

          //Traitement des données pour les ajouter au tableau des participation pour notre chart
          this.chartData = [
            {
              name: 'Médailles',
              series: this.olympic$[0].participations.map(participation => ({
                name: participation.year.toString(),
                value: participation.medalsCount
              }))
            }
          ];

          this.countryData = [
            {
              totalAthletes: this.olympic$[0].participations.reduce((sum, participation) => sum + participation.athleteCount, 0),
              totalMedals: this.olympic$[0].participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
            }
          ]
          // console.log("Total medailles et athletes: ", this.countryData);
          this.isLoading = false;
        },
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChartSize();
  }

  updateChartSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      this.view = [screenWidth * 0.9, 300];
    } else if (screenWidth < 400){
      this.view = [screenWidth * 0.5, 300];
    } else {
      this.view = [800, 400]; // Taille normale sur desktop
    }
  }
}
