import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[animateOnScroll]'
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animateOnScroll: string = 'fadeInUp';
  @Input() animationDelay: number = 0;
  @Input() threshold: number = 0.1; // Câtă parte din element trebuie să fie vizibilă
  @Input() hideInitially: boolean = true; // Nouă opțiune pentru a controla starea inițială

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setInitialState();
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setInitialState() {
    if (!this.hideInitially) return;

    const element = this.el.nativeElement;

    // Adaugă clasa pentru starea inițială
    element.classList.add('animate-on-scroll-hidden');

    // Setări specifice pentru diferite tipuri de animații
    const animationType = this.animateOnScroll.toLowerCase();

    if (animationType.includes('fade')) {
      element.style.opacity = '0';
    }

    if (animationType.includes('up')) {
      element.style.transform = 'translateY(50px)';
      element.style.opacity = '0';
    } else if (animationType.includes('down')) {
      element.style.transform = 'translateY(-50px)';
      element.style.opacity = '0';
    } else if (animationType.includes('left')) {
      element.style.transform = 'translateX(-50px)';
      element.style.opacity = '0';
    } else if (animationType.includes('right')) {
      element.style.transform = 'translateX(50px)';
      element.style.opacity = '0';
    } else if (animationType.includes('zoom') || animationType.includes('bounce')) {
      element.style.transform = 'scale(0.3)';
      element.style.opacity = '0';
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement();
          // Oprește observarea după ce animația a început (opțional)
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateElement() {
    const element = this.el.nativeElement;

    // Elimină clasa de stare inițială
    element.classList.remove('animate-on-scroll-hidden');

    // Resetează stilurile inline pentru a permite animația CSS să preia controlul
    element.style.opacity = '';
    element.style.transform = '';

    // Adaugă clasele necesare pentru animație
    element.classList.add('animate__animated', `animate__${this.animateOnScroll}`);

    // Aplică delay-ul dacă este specificat
    if (this.animationDelay > 0) {
      element.style.animationDelay = `${this.animationDelay}ms`;
    }

    // Curăță clasele după ce animația s-a terminat (opțional)
    element.addEventListener('animationend', () => {
      element.classList.remove('animate__animated', `animate__${this.animateOnScroll}`);
      // Menține elementul vizibil după animație
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.animationDelay = '';
    }, { once: true });
  }
}
