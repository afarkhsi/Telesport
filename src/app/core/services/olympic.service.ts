import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private loading = new BehaviorSubject<boolean>(false)
  private error = new BehaviorSubject<string>('');

  constructor(private http: HttpClient,
    private router: Router,
  ) {}

  loadInitialData() {
    this.loading.next(true); 
    this.error.next('')

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => 
        this.olympics$.next(value)),
      catchError((error) => {
        // TODO: improve error handling
        console.error('Une erreur est survenue lors du chargement des données:', error);
        return [];
      }),
      finalize(() => {
        // End loading state and let the user know something went wrong
        console.log('Chargement des données terminé.');
        this.loading.next(false);
      })
      
    );
  }
  

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getLoadingState() {
    return this.loading.asObservable();
  }

  getErrorState() {
    return this.error.asObservable();
  }

  getOlympicById(olympicId: number): Olympic | undefined {
    const foundOlympic = this.olympics$.getValue().find(o => o.id === olympicId);

    if(!foundOlympic) {    
      this.router.navigate(['/error']);
      throw new Error('Pays ciblé non trouvé')
    }
    return foundOlympic
  }
}
