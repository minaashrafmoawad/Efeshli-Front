import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse, AuthService, LoginRequest } from '../../../../core/services/auth.service';
import { log } from 'console';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials: LoginRequest = this.loginForm.value as LoginRequest;

    this.authService.login(credentials).subscribe({
      next: (response: ApiResponse<string >) => {
        this.isLoading.set(false);
        debugger
      console.log(response.data);
      
        if (response.succeeded && response.data) {
          // Navigate to home or return URL
          this.navigateAfterLogin();
        } else {
          this.handleFailedResponse(response);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.handleError(error);
      }
    });
  }

  private navigateAfterLogin(): void {
    // Check for return URL in query parameters
    const urlTree = this.router.parseUrl(this.router.url);
    const returnUrl = urlTree.queryParams['returnUrl'];
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private handleFailedResponse(response: ApiResponse<string >): void {
    if (response.errors && response.errors.length > 0) {
      this.errorMessage.set(response.errors.join(', '));
    } else {
      this.errorMessage.set(response.message || 'Login failed. Please try again.');
    }
  }

  private handleError(error: any): void {
    if (error.status === 0) {
      this.errorMessage.set('Network error. Please check your internet connection.');
    } else if (error.status === 401) {
      this.errorMessage.set('Invalid email or password. Please try again.');
    } else if (error.error?.message) {
      this.errorMessage.set(error.error.message);
    } else if (error.error?.errors) {
      this.errorMessage.set(error.error.errors.join(', '));
    } else {
      this.errorMessage.set('An unexpected error occurred. Please try again later.');
    }
  }

  private markAllAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}