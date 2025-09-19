import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-circle-nutemi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-nutemi.component.html',
  styleUrl: './circle-nutemi.component.scss'
})
export class CircleNutemiComponent implements OnInit, CommonModule, OnDestroy {
  @ViewChild('layer3', { static: true }) layer3!: ElementRef;
  @ViewChild('layer4', { static: true }) layer4!: ElementRef;

  audioScale: number = 1.0;
  targetScale: number = 1.0;
  isAudioActive = false;

  private animationId?: number;
  private intervalId?: any;

  bubbles: any [] = [
    { top: 20, left: 15, size: 4, delay: 0 },
    { top: 40, left: 80, size: 6, delay: 1 },
    { top: 70, left: 25, size: 3, delay: 2 },
    { top: 60, left: 85, size: 5, delay: 3 },
    { top: 80, left: 70, size: 4, delay: 4 }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.simulateAudioReactivity();
    }, 100);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  simulateAudioReactivity() {
    // Toggle audio active state every 5 seconds
    this.intervalId = setInterval(() => {
      this.isAudioActive = !this.isAudioActive;
      if (this.isAudioActive) {
        this.startAudioAnimation();
      } else {
        this.stopAudioAnimation();
      }
    }, 5000);
  }

  startAudioAnimation() {
    const updateAudioScale = () => {
      if (!this.isAudioActive) return;

      // Simulate audio level changes
      const time = Date.now() / 1000;
      const baseLevel = 0.3 + Math.sin(time * 2) * 0.2;
      const randomSpikes = Math.random() < 0.15 ? Math.random() * 0.4 : 0;
      this.targetScale = 1.0 + Math.max(0, Math.min(1, baseLevel + randomSpikes)) * 0.4;

      // Smooth transition
      this.audioScale += (this.targetScale - this.audioScale) * 0.15;

      // Apply scaling to layers 3 and 4
      if (this.layer3?.nativeElement) {
        this.layer3.nativeElement.style.transform = `scale(${this.audioScale})`;
      }
      if (this.layer4?.nativeElement) {
        this.layer4.nativeElement.style.transform = `scale(${this.audioScale * 0.95})`;
      }

      this.animationId = requestAnimationFrame(updateAudioScale);
    };

    updateAudioScale();
  }

  stopAudioAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Reset layers to normal scale
    if (this.layer3?.nativeElement) {
      this.layer3.nativeElement.style.transform = 'scale(1)';
    }
    if (this.layer4?.nativeElement) {
      this.layer4.nativeElement.style.transform = 'scale(1)';
    }
  }
}
