import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withInMemoryScrolling, withRouterConfig} from '@angular/router';
import {provideLottieOptions} from 'ngx-lottie';
import player from 'lottie-web';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideLottieOptions({
      player: () => player,
    }),
  ]
};
