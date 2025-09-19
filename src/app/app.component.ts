import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ViewportScroller} from "@angular/common";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  // Salvează poziția la fiecare derulare
  @HostListener('window:scroll')
  onWindowScroll() {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Așteaptă un scurt moment pentru ca DOM-ul să se încarce
      setTimeout(() => {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          this.viewportScroller.scrollToPosition([0, parseInt(scrollPosition, 10)]);
        }
      }, 150); // Poți mări acest timp dacă API-urile tale răspund mai greu
    });
  }
}
