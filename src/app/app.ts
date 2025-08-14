import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './features/auth/components/signup/signup';
import { LoginComponent } from './features/auth/components/login/login';
/* import { CartItems } from './features/cart/Components/cart-items/cart-items'; */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignUp, LoginComponent, /* CartItems */], // استخدم CartItemsComponent
  templateUrl: './app.html', // استخدم الاسم القياسي
  styleUrls: ['./app.css']
})
export class AppComponent {
  protected readonly title = signal('eFreshli-clone');
}