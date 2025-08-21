import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
import { CartItemsComponent } from './features/cart/components/cart-items/cart-items';
import { ReactiveFormsModule } from '@angular/forms';
// import { EmailConfirmationComponent } from './features/auth/components/EmailConfirmation/EmailConfirmation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class AppComponent {
  protected readonly title = signal('eFreshli-clone');
}