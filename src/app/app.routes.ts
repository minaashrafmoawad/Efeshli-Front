import { provideRouter, Routes } from '@angular/router';
import { ReverseAuthGuard } from './core/guards/reverse-auth-guard';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
import { HomeComponent } from './features/home/home.component';
import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { AuthGuard } from './core/guards/auth-guard';
import { TestComponent } from './features/auth/components/test-component/test-component.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login',  loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent),canActivate:[AuthGuard] },
  {path:'signup',loadComponent:()=>import('./features/auth/components/signup/signup').then(m=>m.SignupComponent)},
  { path: 'confirm-email', component: EmailConfirmationComponent, canActivate: [AuthGuard] },
  {path:"forgot-password",component:ForgotPasswordComponent},
  {path:"reset-password",component:ResetPasswordComponent},
  {path:"test",component:TestComponent},
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartItemsComponent },
  { path: 'full-cart', component: FullCartItemsComponent },
  { path: 'product-details/:id', component: ProductDetailPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

export const appRouterProviders = provideRouter(routes);




























// import { provideRouter, Routes } from '@angular/router';
// import { LoginComponent } from './features/auth/components/login/login';
// import { PaymentMethods } from './features/checkout/components/payment-methods/payment-methods';
// import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';

// import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
// import { SignupComponent } from './features/auth/components/signup/signup';
// import { AuthGuard } from './core/guards/auth-guard';
// import { ReverseAuthGuard } from './core/guards/reverse-auth-guard';
// import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
// import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
// import { HomeComponent } from './features/home/home.component';

// export const routes: Routes =[
// // login 
//   { path: 'login',  loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent),canActivate:[AuthGuard] },
//   // register
//   { path: 'signup',  loadComponent: () => import('./features/auth/components/signup/signup').then(m => m.SignupComponent),
//     canActivate: [AuthGuard] },
//   {path: 'confirm-email', component: EmailConfirmationComponent, canActivate: [AuthGuard,ReverseAuthGuard]},
//   {path:'home',component:HomeComponent},
  
//   { path: 'cart', component: CartItemsComponent },
//   { path: 'full-cart', component: FullCartItemsComponent },
//    { path: 'product-details/:id', component: ProductDetailPageComponent },

//   // { path: 'product-details/:id', component: ProductDetailPageComponent },
// // payment
// // {
// //     path: 'payment',
// //     loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
// //     canActivate: [ReverseAuthGuard] // Require authentication
// //   },
//   // { path: 'products/:slug', component: ProductDetailPageComponent },
//     { path: '', redirectTo: 'home' },

//   // { path: '**', redirectTo: '' }

// ];

// export const appRouterProviders = provideRouter(routes);





