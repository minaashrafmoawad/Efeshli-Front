// app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Components
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import {FullCartItemsComponent } from './shared/components/full-cart/full-cart-items';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SignUp,
    LoginComponent,
    CartItemsComponent,
    FullCartItemsComponent, // ✅ ضفته هنا
    ProductDetailPageComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = signal('eFreshli-clone');
}
