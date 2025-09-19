import {Component, OnInit} from '@angular/core';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";
import {CircleNutemiComponent} from "../components/circle-nutemi/circle-nutemi.component";
import {ScrollSliderComponent} from "../components/slide-data/slide-data.component";
import {PhotoMealComponent} from "../components/photo-meal/photo-meal.component";
import {SpeechComponent} from "../components/speech/speech.component";
import {AnimateOnScrollDirective} from "../animate-on-scroll.directive";
import {AnimationService} from "../services/animation.service";
import {OpenAIRTCService} from "../services/openai-rtc.service";
import {ScreenSizeService} from "../services/screen-size.service";
import {MobileViewComponent} from "../mobile-view/mobile-view.component";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LottieComponent,
    CircleNutemiComponent,
    ScrollSliderComponent,
    PhotoMealComponent,
    SpeechComponent,
    AnimateOnScrollDirective,
    MobileViewComponent,
    RouterLink,
  ],
  providers: [AnimationService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  appUrl = 'https://apps.apple.com/us/app/nutemi-ai/id6746331232';
  year: number = new Date().getFullYear();
  isConnected: boolean = false;
  isDesktop: boolean = true;

  constructor(
    private rtcService: OpenAIRTCService,
    private screenSizeService: ScreenSizeService,
  ) {
  }

  ngOnInit() {
    this.screenSizeService.isDesktop$.subscribe(value => {
      this.isDesktop = value;
    });
    this.rtcService.connectionState$.subscribe((data) => {
      console.log(data.isConnected);
      this.isConnected = data.isConnected;
    }, error => {
      console.log(error);
    });
  }

  options: AnimationOptions = {
    path: '/animation/1.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  async startVoiceAssistant() {
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

  redirectToExternalLink() {
    window.open(this.appUrl, '_blank'); // Tab nou
  }
}
