import { Component } from '@angular/core';
import { MealResponse } from '../meal/meal.module';
import { ApicallsService } from '../apicalls.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-meal-slide-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-slide-panel.component.html',
  styleUrl: './meal-slide-panel.component.css'
})
export class MealSlidePanelComponent {
  safeYoutubeUrl: SafeResourceUrl | null = null;

  constructor(
    public service: ApicallsService,
    private sanitizer: DomSanitizer
  ) {}

  ngDoCheck(): void {
    if (this.service.displayDish) {
      this.updateYoutubeUrl(this.service.displayDish.strYoutube);
    }
  }

  updateYoutubeUrl(url: string | null) {
    if (!url) {
      this.safeYoutubeUrl = null;
      return;
    }

    const match = url.match(/v=([^&]+)/);
    const id = match ? match[1] : null;

    this.safeYoutubeUrl = id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${id}`
        )
      : null;
  }

  addToFavorites() {
    if (this.service.displayDish) {
      alert(`${this.service.displayDish.strMeal} added to favorites`);
      this.service.addToFavs(this.service.displayDish);
    }
  }

  getIngredients(data: any): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = data[`strIngredient${i}`]?.trim();
      const measure = data[`strMeasure${i}`]?.trim();
      if (ingredient && ingredient !== '') {
        ingredients.push(`${ingredient} : ${measure || ''}`);
      }
    }
    return ingredients;
  }
}

