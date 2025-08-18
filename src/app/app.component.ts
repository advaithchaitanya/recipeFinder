import { Component, DoCheck } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { ApicallsService } from './apicalls.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealSlidePanelComponent } from './meal-slide-panel/meal-slide-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,CommonModule,FormsModule,MealSlidePanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements DoCheck{
  constructor(public service:ApicallsService){}
  
  ngDoCheck(): void {
    if (this.service.active) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }  
  title = 'recipeFinder';
}
