import { Component } from '@angular/core';
import { PaymentService } from '../../../../core/services/Payment.service';

@Component({
  selector: 'app-payment-methods',

  templateUrl: './payment-methods.html',
  styleUrl: './payment-methods.css'
})
export class PaymentMethods {
constructor(private paymentService: PaymentService) {}

  payNow() {
    const paymentDto = {
     "couponCode":"MINA"
    };
    this.paymentService.createCheckoutSession(paymentDto);
  }
}
