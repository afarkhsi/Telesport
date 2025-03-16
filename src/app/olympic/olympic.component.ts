import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../core/services/olympic.service';
import { Olympic } from '../core/models/Olympic';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { take } from 'rxjs';

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

  constructor(private olympicService: OlympicService){}

  ngOnInit(): void {
    this.olympicService.getLoadingState().subscribe((loading) => {
      this.loading = loading;  // Met à jour l'état de chargement
    });
    
    this.olympicService.getErrorState().subscribe((error) => {
      this.error = error;  // Met à jour le message d'erreur
    });

    this.olympicService.loadInitialData().pipe(take(1)).subscribe(
      (data) => {
        this.olympics = data ;  // Si tout se passe bien, on met les données dans la variable 
        //olympics
        console.log('affiche la donnée:', this.olympics)
      }
    );
  }  
}
