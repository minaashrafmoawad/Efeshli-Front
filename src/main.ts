// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appRouterProviders } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    appRouterProviders,
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(FormsModule), // إضافة FormsModule للـ ProfileComponent
  ],
}).catch(err => console.error(err));


