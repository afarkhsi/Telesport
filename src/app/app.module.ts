import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OlympicService } from './core/services/olympic.service';
import { OlympicComponent } from "./olympic/olympic.component";
import { CommonModule } from '@angular/common';  

@NgModule({
  declarations: [AppComponent, NotFoundComponent, HomeComponent, OlympicComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, CommonModule],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
