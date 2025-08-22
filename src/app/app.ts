import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { ReactiveFormsModule } from '@angular/forms';
// import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { SignupComponent } from './features/auth/components/signup/signup';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SignupComponent, LoginComponent, CartItemsComponent, ProductDetailPageComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class AppComponent {
  protected readonly title = signal('eFreshli-clone');
}