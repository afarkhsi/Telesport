import { Component, OnInit } from '@angular/core';
import { Participation } from '../core/models/Participation';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Olympic } from '../core/models/Olympic';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Countrydetails } from '../core/models/CountryDetails';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  standalone: false,
})

export class LineChartComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  olympic$: Olympic[] = [];
  countryData : Partial <Participation>[] = []
  olympicId: number | null = null;
  isLoading = false;
  animationState = 'inactive'; 

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

    // Tableau ayant pour résultat les données traitées et récupérées
  chartData: Partial <Participation>[] = [];




  colorScheme = {
    name: 'customScheme',      // Le nom de ton schéma de couleurs
    selectable: true,          // Permet de sélectionner une ligne
    group: 'ordinal',          // Type de palette (idéal pour plusieurs séries de données)
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] // Les couleurs que tu veux utiliser
  };

  ngOnInit(): void {
    this.olympicService.getLoadingState().subscribe((loading) => {
      this.loading = loading;  // Met à jour l'état de chargement
    });
    
    this.olympicService.getErrorState().subscribe((error) => {
      this.error = error;  // Met à jour le message d'erreur
    });

    console.log('ngOnInit - Chargement des données...');
    this.loadOlympicDataById();
  }

  loadOlympicDataById() {
    this.isLoading = true;
  
    // Charge les données depuis le service
    this.olympicService.loadInitialData().subscribe({
      next: () => {
        // On recupère l'ID depuis notre url
        this.olympicId = +this.route.snapshot.params['id'];
        console.log("ID de l'url:", this.olympicId);
  
        const olympic = this.olympicService.getOlympicById(this.olympicId);
  
        if (!olympic) {
          console.warn(`Pas de données à cet id: ${this.olympicId}`);
        } else {
          console.log("Données existantes pour cet id:", olympic);
        }
  
        this.olympic$ = olympic ? [olympic] : [];
        console.log("this olympic country:", this.olympic$[0].country);
        this.isLoading = false;

        //Traitement des données pour les ajouter au tableau des participation pour notre chart
        this.chartData = [
          {
            name: 'Médailles', // Nom de la courbe
            series: this.olympic$[0].participations.map(participation => ({
              name: participation.year.toString(), // X-axis (Année)
              value: participation.medalsCount    // Y-axis (Nombre de médailles)
            }))
          }
        ];

        this.countryData = [
          {
            totalAthletes: this.olympic$[0].participations.reduce((sum, participation) => sum + participation.athleteCount, 0),
            totalMedals: this.olympic$[0].participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
          }
        ]
      
        console.log("Total medailles et athletes: ", this.countryData);
      },
    });
  }


}
