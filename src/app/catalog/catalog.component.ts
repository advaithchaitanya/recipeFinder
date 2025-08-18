import { Component, OnInit } from '@angular/core';
import { ApicallsService } from '../apicalls.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as AOS from 'aos';
import { Meal } from '../meal/meal.module';
@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'], // fixed typo: "styleUrl" -> "styleUrls"
})
export class CatalogComponent implements OnInit {
  select = '';
  category!: any;
  meals: any[] = [];
  loading = false;

  constructor(public api: ApicallsService) {}

  ngOnInit() {
    AOS.init();

    this.loading = true;

    this.api.getCategories().subscribe({
      next:(res: any) => {
      this.category = res.meals
        .filter((i: any) => i.strCategory != 'Beef')
        .map((i: any) => i.strCategory);
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
        behavior: 'smooth',
      });
    },
  error:(error)=>{
    console.error("i got error:"+error);
    
  }});
    this.api.getMealsByCategory('BreakFast').subscribe((res: any) => {
      this.meals = res.meals;
      console.log('main yam yam', this.meals);
      this.loading = false;
    });
  }

  async selectCategory() {
    if (!this.select) return;
    this.loading = true;
    this.api.getMealsByCategory(this.select).subscribe((res: any) => {
      this.meals = res.meals;
      console.log('main yam yam', this.meals);
      this.loading = false;
    });
  }

  async selectMeal(a: Meal) {
    const fullMeal = await firstValueFrom(this.api.getMealById(a.idMeal));
    this.api.toggleByCard(fullMeal.meals[0]); // full meal data now sent to service
  }
}
