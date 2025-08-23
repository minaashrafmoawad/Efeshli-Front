import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { ReactiveFormsModule } from '@angular/forms';
// import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';
import { ProductDetailPageComponent } from './features/products/components/product-details/product-details';
import { SignupComponent } from './features/auth/components/signup/signup';
import { HeaderComponent } from "./shared/components/header/header";
import { FooterComponent } from "./shared/components/footer/footer";
import { HomeComponent } from "./features/home/home.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignupComponent, LoginComponent, CartItemsComponent, ProductDetailPageComponent, HeaderComponent, FooterComponent, HomeComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class AppComponent {
  protected readonly title = signal('eFreshli-clone');
}