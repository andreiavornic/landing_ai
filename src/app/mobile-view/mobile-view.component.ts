import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {CircleNutemiComponent} from "../components/circle-nutemi/circle-nutemi.component";
import {OpenAIRTCService} from "../services/openai-rtc.service";
import {ScreenSizeService} from "../services/screen-size.service";
import {DOCUMENT} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-mobile-view',
  standalone: true,
  imports: [
    LottieComponent,
    CircleNutemiComponent,
    RouterLink
  ],
  templateUrl: './mobile-view.component.html',
  styleUrl: './mobile-view.component.scss'
})
export class MobileViewComponent implements OnInit {

  appUrl = 'https://apps.apple.com/us/app/nutemi-ai/id6746331232';
  imgs: string[] = ["12", "12_1", "12_2", "12_3"];
  year: number = new Date().getFullYear();
  isConnected: boolean = false;
  isLoading: boolean = false;
  curentSlide = 0;

  options: AnimationOptions = {
    path: '/animation/1.json',
  };

  constructor(
    private rtcService: OpenAIRTCService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {
    this.rtcService.connectionState$.subscribe((data) => {
      console.log(data.isConnected);
      this.isConnected = data.isConnected;
      if (this.isConnected) {
        this.addFixed();
      } else {
        this.deleteFixed();
      }
      this.isLoading = false;
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  addFixed() {
    this.renderer.addClass(this.document.body, 'fixed');
  }

  deleteFixed() {
    this.renderer.removeClass(this.document.body, 'fixed');
  }

  activateSlide(index: number) {
    if (index < 4)
      this.curentSlide = index;
  }

  async startVoiceAssistant() {
    this.isLoading = true;
    try {
      await this.rtcService.connect();
    } catch (error) {
      console.error('Eroare la conectare:', error);
    }
  }

  stopVoiceAssistant() {
    try {
      this.rtcService.disconnect();
    } catch (error) {
      console.error('Eroare la conectare:', error);
    }
  }

  protected readonly confirm = confirm;
}
