
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appRouterProviders } from './app/app.routes';

import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideZoneChangeDetection } from '@angular/core';
bootstrapApplication(AppComponent, {
  providers: [appRouterProviders,  provideZoneChangeDetection({ eventCoalescing: true }) ,
   provideHttpClient(withInterceptors([authInterceptor]))]
});

