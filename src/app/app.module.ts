import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OlympicService } from './core/services/olympic.service';
import { OlympicComponent } from "./olympic/olympic.component";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountryPageComponent } from './pages/country-page/country-page.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, HomeComponent, OlympicComponent, LineChartComponent, CountryPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgxChartsModule, BrowserAnimationsModule],
  providers: [OlympicService, provideAnimations()],
  bootstrap: [AppComponent],
})
export class AppModule {}
