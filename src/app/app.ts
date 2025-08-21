import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignUp, LoginComponent, CartItemsComponent, ProductDetailPageComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class AppComponent {
  protected readonly title = signal('eFreshli-clone');
}