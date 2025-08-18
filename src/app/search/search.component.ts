import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApicallsService } from '../apicalls.service';
import * as AOS from 'aos';
@Component({
  selector: 'app-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    userInput = '';
  meals: any[] = [];
  loading = true;

  constructor(public search: ApicallsService) {}

  ngOnInit() {
    AOS.init();
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
    this.search.getBySearch().subscribe({
      next: (res:any) => {
        this.meals = res.meals || [];
        this.loading = false;
        AOS.refresh(); // re-apply animations on new DOM
      },
      error: (err:any) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    })
  }

  searchMeal() {
    if (!this.userInput.trim()) return;

    this.loading = true;
    this.search.getBySearch(this.userInput.trim()).subscribe({
      next:(res:any) => {
        this.meals = res.meals || [];
        this.loading = false;
        AOS.refresh(); // re-apply animations on new DOM
      },
      error: (err:any) => {
        // err="Cantact admistrator"
        console.error('API Error:', err);
        this.loading = false;
      }
    });
  }

  selectMeal(name: string) {
    console.log('Selected meal:', name);
    // You can add routing or modal here later
  }
}
