import { provideRouter, Routes } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
import { ProfileComponent } from './shared/components/profile/profile'; 
import {OrdersComponent} from './shared/components/order/order';

export const routes: Routes = [
  { path: 'signup', component: SignUp },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartItemsComponent },
  { path: 'full-cart', component: FullCartItemsComponent },
  { path: 'profile', component: ProfileComponent }, 
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'product-details/:id', component: ProductDetailPageComponent },
  { path: 'orders', component: OrdersComponent },
  // { path: 'products/:slug', component: ProductDetailPageComponent },
  { path: '**', redirectTo: '' }
];

export const appRouterProviders = provideRouter(routes);