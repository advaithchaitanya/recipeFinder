import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-hero',
  imports: [CommonModule,FormsModule ,RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit{
carouselImages=['https://imgs.search.brave.com/yvKJoml_X2gjJzW53wgcxRp67bpefRW1DjPbfL2ZQAs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5jbm4uY29tL2Fw/aS92MS9pbWFnZXMv/c3RlbGxhci9wcm9k/LzE3MDMwMjE0NTAx/MS1wZW5hbmctYXNz/YW0tbGFrc2EtbWFs/YXlzaWEuanBnP3E9/d18xMTEwLGNfZmls/bA',
                'https://imgs.search.brave.com/LX7uHDlK5AX3H_cwXGzO92AHU_efeUzNySTQ_sgpezI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YnNjZWR1Y2F0aW9u/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAxOS8wNy9TdGVh/a19hbmRfa2lkbmV5/X3BpZV9hdF90aGVf/V2hpdGVfSGFydF9J/bm5fTW9yZXRvbl9F/c3NleF9FbmdsYW5k/XzAyLmpwZw',
                'https://imgs.search.brave.com/czulbaj-9u96dIwduOE4juH3xVbPKV363Ik-1ZZb3HM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YnNjZWR1Y2F0aW9u/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAxOS8wNy9DaGlj/a2VuX1Rpa2thX01h/c2FsYS0wMS5qcGc',
]
hasfav=false
  ngOnInit() {
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
    AOS.init();
    const stored=JSON.parse(localStorage.getItem('favs')|| '[]')
    if (stored.length===0){
      return 
    }
    this.hasfav=true
    console.log(stored);
    const imgLis=stored.map((i:any)=>{return i.strMealThumb})
    this.carouselImages=imgLis
    
  }
   currentIndex = 0;
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.carouselImages.length) %
      this.carouselImages.length;
  }
}
