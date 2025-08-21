import { provideRouter, Routes } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { PaymentMethods } from './features/checkout/components/payment-methods/payment-methods';
import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';

export const routes: Routes =[
  // { path: 'signup', component: SignUp },
  // { path: 'login', component: LoginComponent },
  {path: 'confirm-email', component: EmailConfirmationComponent},
  // {path:"pay",component:PaymentMethods},
  // { path: '', redirectTo: 'signup', pathMatch: 'full' },

];

export const appRouterProviders = provideRouter(routes);
