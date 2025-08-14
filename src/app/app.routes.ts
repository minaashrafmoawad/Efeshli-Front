import { provideRouter, Routes } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';

export const routes: Routes =[
  { path: 'signup', component: SignUp },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' }
];

export const appRouterProviders = provideRouter(routes);
