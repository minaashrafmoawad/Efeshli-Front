import { provideRouter, Routes } from '@angular/router';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
import { HomeComponent } from './features/home/home.component';
import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { TestComponent } from './features/auth/components/test-component/test-component.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';
import { authGuard } from './core/guards/auth-guard';
import { reverseAuthGuard } from './core/guards/reverse-auth-guard';
export const routes: Routes = [
  { 
    path: 'login',  
    loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent),
    canActivate: [reverseAuthGuard] // ✅ Correct: functional guard reference
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/components/signup/signup').then(m => m.SignupComponent),
    canActivate: [reverseAuthGuard] // ✅ Correct: functional guard reference
  },
  { 
    path: 'confirm-email', 
    component: EmailConfirmationComponent, 
    canActivate: [reverseAuthGuard] // ✅ Correct: functional guard reference
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [reverseAuthGuard] // ✅ Correct: functional guard reference
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [reverseAuthGuard] // ✅ Correct: functional guard reference
  },
  {
    path: "test",
    component: TestComponent,
    canActivate: [authGuard] // ✅ Correct: functional guard reference
  },
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: 'cart', 
    component: CartItemsComponent,
    canActivate: [authGuard] // ✅ Correct: functional guard reference
  },
  { 
    path: 'full-cart', 
    component: FullCartItemsComponent,
    canActivate: [authGuard] // ✅ Correct: functional guard reference
  },
  { 
    path: 'product-details/:id', 
    component: ProductDetailPageComponent 
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];

export const appRouterProviders = provideRouter(routes);
// export const routes: Routes = [
//   { 
//     path: 'login',  
//     loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent),
//     canActivate: [reverseAuthGuard]
//   },
//   {
//     path: 'signup',
//     loadComponent: () => import('./features/auth/components/signup/signup').then(m => m.SignupComponent),
//     canActivate: [reverseAuthGuard]
//   },
//   { 
//     path: 'confirm-email', 
//     component: EmailConfirmationComponent, 
//     canActivate: [reverseAuthGuard] 
//   },
//   {
//     path: "forgot-password",
//     component: ForgotPasswordComponent,
//     canActivate: [reverseAuthGuard] // Typically, you don't want authenticated users accessing forgot password
//   },
//   {
//     path: "reset-password",
//     component: ResetPasswordComponent,
//     canActivate: [reverseAuthGuard] // Typically, you don't want authenticated users accessing reset password
//   },
//   {
//     path: "test",
//     component: TestComponent,
//     canActivate: [authGuard] // Assuming test component requires authentication
//   },
//   { 
//     path: 'home', 
//     component: HomeComponent 
//   },
//   { 
//     path: 'cart', 
//     component: CartItemsComponent,
//     canActivate: [authGuard] // Cart requires authentication
//   },
//   { 
//     path: 'full-cart', 
//     component: FullCartItemsComponent,
//     canActivate: [authGuard] // Full cart requires authentication
//   },
//   { 
//     path: 'product-details/:id', 
//     component: ProductDetailPageComponent 
//   },
//   { 
//     path: '', 
//     redirectTo: 'home', 
//     pathMatch: 'full' 
//   },
//   { 
//     path: '**', 
//     redirectTo: 'home' 
//   }
// ];

// export const appRouterProviders = provideRouter(routes);

















// import { provideRouter, Routes } from '@angular/router';
// import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
// import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
// import { HomeComponent } from './features/home/home.component';
// import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';
// import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
// import { TestComponent } from './features/auth/components/test-component/test-component.component';
// import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
// import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';

// export const routes: Routes = [
//   { path: 'login',  loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent) ,canActivate:[ReverseAuthGuard]},
//   {path:'signup',loadComponent:()=>import('./features/auth/components/signup/signup').then(m=>m.SignupComponent),canActivate:[ReverseAuthGuard]},
//   { path: 'confirm-email', component: EmailConfirmationComponent, canActivate: [ReverseAuthGuard] },
//   {path:"forgot-password",component:ForgotPasswordComponent},
//   {path:"reset-password",component:ResetPasswordComponent},
//   {path:"test",component:TestComponent},
//   { path: 'home', component: HomeComponent },
//   { path: 'cart', component: CartItemsComponent ,canActivate:[AuthGuard]},
//   { path: 'full-cart', component: FullCartItemsComponent ,canActivate:[AuthGuard]},
//   { path: 'product-details/:id', component: ProductDetailPageComponent },
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: '**', redirectTo: 'home' }
// ];

// export const appRouterProviders = provideRouter(routes);



