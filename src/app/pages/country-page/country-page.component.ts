import { Component, OnInit } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.scss',
  standalone: false
})
export class CountryPageComponent implements OnInit {
  olympic$: Olympic[] = [];
  olympicId: number | null = null;
  isLoading = false;

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
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
      },
    });
  }
}
