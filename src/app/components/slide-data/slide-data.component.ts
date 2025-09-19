import {Component, OnInit, OnDestroy, ElementRef, ViewChild, } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-scroll-slider',
  templateUrl: './slide-data.component.html',
  standalone: true,

  styleUrls: ['./slide-data.component.scss']
})
export class ScrollSliderComponent implements OnInit, OnDestroy {
  appUrl = 'https://apps.apple.com/us/app/nutemi-ai/id6746331232';
  activeSlide: string = '12';
  @ViewChild('sliderContainer', {static: true}) sliderContainer!: ElementRef;

  private autoSlideInterval: any;
  private slides: string[] = ['12', '12_1', '12_2', '12_3']; // Adaugă toate slide-urile tale aici
  private currentIndex: number = 0;

  ngOnInit() {
    // Setează index-ul curent bazat pe activeSlide
    this.currentIndex = this.slides.indexOf(this.activeSlide);
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
    }

    // Pornește sliderul automat
    this.startAutoSlide();
  }

  ngOnDestroy() {
    // Curăță intervalul când componenta se distruge
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  changeActiveSlide(activeSlide: string) {
    // Oprește sliderul automat și toate timeout-urile
    this.clearAutoSlide();

    // Schimbă slide-ul
    this.activeSlide = activeSlide;
    this.currentIndex = this.slides.indexOf(activeSlide);

    // Repornește sliderul automat după 4 secunde
    setTimeout(() => {
      // Verifică din nou dacă nu există deja un interval activ
      if (!this.autoSlideInterval) {
        this.startAutoSlide();
      }
    }, 4000);
  }

  private startAutoSlide() {
    // Asigură-te că nu există deja un interval activ
    this.clearAutoSlide();

    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private clearAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  private nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.activeSlide = this.slides[this.currentIndex];
  }

  redirectToExternalLink() {
    window.open(this.appUrl, '_blank'); // Tab nou
  }
}
