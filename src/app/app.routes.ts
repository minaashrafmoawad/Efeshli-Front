import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { PaymentMethods } from './features/checkout/components/payment-methods/payment-methods';
import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';

import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { SignupComponent } from './features/auth/components/signup/signup';
import { AuthGuard } from './core/guards/auth-guard';
import { ReverseAuthGuard } from './core/guards/reverse-auth-guard';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';

export const routes: Routes =[
// login 
  { path: 'login',  loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent),canActivate:[AuthGuard] },
  // register
  { path: 'signup',  loadComponent: () => import('./features/auth/components/signup/signup').then(m => m.SignupComponent),
    canActivate: [AuthGuard] },
  {path: 'confirm-email', component: EmailConfirmationComponent, canActivate: [AuthGuard,ReverseAuthGuard]},
  { path: 'cart', component: CartItemsComponent },
  { path: 'full-cart', component: FullCartItemsComponent },
   { path: 'product-details/:id', component: ProductDetailPageComponent },

  // { path: 'product-details/:id', component: ProductDetailPageComponent },
// payment
// {
//     path: 'payment',
//     loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
//     canActivate: [ReverseAuthGuard] // Require authentication
//   },
  // { path: 'products/:slug', component: ProductDetailPageComponent },
    // { path: '', redirectTo: 'login', pathMatch: 'full' },

  // { path: '**', redirectTo: '' }

];

export const appRouterProviders = provideRouter(routes);





