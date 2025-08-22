// shared/full-cart/full-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  image: string;
  dimensions: string;
  fabric: string;
  fabricColor: string;
  wood: string;
  woodColor: string;
  price: number;
  quantity: number;
  readyToShip: boolean;
}

@Component({
  selector: 'app-full-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './full-cart-items.html',
  styleUrls: ['./full-cart-items.css'] // تغيير من scss إلى css
})
export class FullCartItemsComponent implements OnInit {
  
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Mini Vintage Chair In Plywood & Pine Wood - Upholstered',
      image: '/assets/images/vintage-chair.jpg',
      dimensions: 'L 65 x D 74 x H 70 cm',
      fabric: 'Mint Blue Linen',
      fabricColor: '#a8d5ba',
      wood: 'Ebony & Ivory Massive',
      woodColor: '#8b6f47',
      price: 11641,
      quantity: 1,
      readyToShip: true
    }
  ];

  vatRate = 14;
  shippingMessage = 'Calculated at the next step.';

  ngOnInit(): void {
    // Component initialization
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get vatAmount(): number {
    return this.subtotal * (this.vatRate / 100);
  }

  get total(): number {
    return this.subtotal;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      item.quantity = quantity;
    }
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  downloadCart(): void {
    // Implement download cart functionality
    console.log('Download cart functionality');
  }

  proceedToCheckout(): void {
    // Implement checkout functionality
    console.log('Proceed to checkout');
  }

  contactSupport(type: 'phone' | 'email'): void {
    if (type === 'phone') {
      window.location.href = 'tel:+201000748719';
    } else {
      window.location.href = 'mailto:hello@efreshii.com';
    }
  }
}