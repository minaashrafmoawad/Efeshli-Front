import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrdersComponent {
  
  startShopping() {
    // Handle navigation to products or shopping page
    console.log('Navigate to shopping page');
  }

  signOut() {
    // Handle sign out logic
    console.log('Sign out user');
  }
}