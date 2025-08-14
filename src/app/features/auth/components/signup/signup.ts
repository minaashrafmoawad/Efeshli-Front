import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignUp {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  // للتحكم في عرض وإخفاء كلمة السر
  showPassword = false;
  showConfirmPassword = false;

  signup() {
    console.log('Form data:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }
  togglePassword(field: string) {
  const input = document.querySelector<HTMLInputElement>(`input[name="${field}"]`);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

}
