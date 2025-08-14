import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appRouterProviders } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [appRouterProviders]
});
