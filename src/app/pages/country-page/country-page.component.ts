import { Component, OnInit } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Participation } from 'src/app/core/models/Participation';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.scss',
  standalone: false
})
export class CountryPageComponent implements OnInit {

   ngOnInit(): void {
   }
}
