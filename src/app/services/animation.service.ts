import { Injectable } from '@angular/core';

export interface AnimationConfig {
  name: string;
  delay?: number;
  duration?: number;
  repeat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  /**
   * Aplică o animație Animate.css pe un element
   */
  animate(element: HTMLElement, config: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      const animationName = `animate__${config.name}`;

      // Curăță animațiile anterioare
      this.clearAnimations(element);

      // Aplică stilurile
      element.classList.add('animate__animated', animationName);

      if (config.delay) {
        element.style.animationDelay = `${config.delay}ms`;
      }

      if (config.duration) {
        element.style.animationDuration = `${config.duration}ms`;
      }

      if (config.repeat) {
        element.style.animationIterationCount = config.repeat.toString();
      }

      // Ascultă sfârșitul animației
      const handleAnimationEnd = () => {
        this.clearAnimations(element);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
  }

  /**
   * Curăță toate clasele și stilurile de animație
   */
  private clearAnimations(element: HTMLElement) {
    // Elimină toate clasele animate__*
    const animateClasses = Array.from(element.classList).filter(c => c.startsWith('animate__'));
    element.classList.remove(...animateClasses);

    // Resetează stilurile
    element.style.animationDelay = '';
    element.style.animationDuration = '';
    element.style.animationIterationCount = '';
  }

  /**
   * Verifică dacă un element este vizibil în viewport
   */
  isElementVisible(element: HTMLElement, threshold: number = 0.1): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return (
      rect.top >= 0 &&
      rect.top <= windowHeight * (1 - threshold)
    );
  }
}
