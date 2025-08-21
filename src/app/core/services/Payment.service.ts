import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:5136/api/payments'; // your backend

  constructor(private http: HttpClient) {}

  async createCheckoutSession(paymentDto: any) {
    const stripe = await loadStripe('pk_test_xxxxx'); // your publishable key
    return this.http.post<any>(`${this.baseUrl}/Checkout`, paymentDto)
      .toPromise()
      .then(async (res: any) => {
        if (res.url) {
          window.location.href = res.url; // redirect to Stripe Checkout
        }
      });
  }
}
