import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterDto } from '../../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
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

  showPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService) {}

  signup() {
    const registerData: RegisterDto = {
      firstName: this.firstName, 
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('✅ Registration successful:', response);
        alert('User registered successfully!');
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        alert('Registration failed. Please try again.');
      }
    });
  }

  togglePassword(field: string) {
    const input = document.querySelector<HTMLInputElement>(`input[name="${field}"]`);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
