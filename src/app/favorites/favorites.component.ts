import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApicallsService } from '../apicalls.service';
import * as AOS from 'aos';
import { firstValueFrom } from 'rxjs';
import { Meal } from '../meal/meal.module';
@Component({
  selector: 'app-favorites',
  imports: [CommonModule,FormsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
  
  constructor(public server:ApicallsService){}
   meals: any[] = [];
  loading = true;
  ngOnInit() {
      AOS.init();
      this.meals=this.server.cart
      this.loading=false
          let scrollValue = 0;

if (window.innerWidth >= 1024) {
  // large screen (lg+)
  scrollValue = 100;
} else if (window.innerWidth >= 768) {
  // medium screen (md)
  scrollValue = 50;
} else {
  // small screen (sm)
  scrollValue = 20;
}
      window.scrollTo({
    top: scrollValue,
    behavior: 'smooth'
  })
    }

    async selectMeal(a: Meal) {
      const fullMeal = await firstValueFrom(this.server.getMealById(a.idMeal)) as { meals: Meal[] };
      this.server.toggleByCard(fullMeal.meals[0]); // full meal data now sent to service
    }
}

