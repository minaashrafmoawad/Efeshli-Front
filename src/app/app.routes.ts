import { provideRouter, Routes } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';

export const routes: Routes =[

  { path: 'signup', component: SignUp },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'product-details/:id', component: ProductDetailPageComponent },
  // { path: 'products/:slug', component: ProductDetailPageComponent },
  { path: '**', redirectTo: '' }
];

export const appRouterProviders = provideRouter(routes);





