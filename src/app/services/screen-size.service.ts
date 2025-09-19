// screen-size.service.ts
import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private isDesktopSubject = new BehaviorSubject<boolean>(window.innerWidth > 991.98);
  isDesktop$ = this.isDesktopSubject.asObservable();

  constructor() {
    this.checkWidth();
    window.addEventListener('resize', () => this.checkWidth());
  }

  private checkWidth(): void {
    this.isDesktopSubject.next(window.innerWidth > 991.98);
  }
}
