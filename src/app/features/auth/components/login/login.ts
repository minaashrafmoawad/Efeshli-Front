import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiResponse, AuthService, LoginRequest } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule,RouterLink],
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
    }  }

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

    const credentials: LoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response: ApiResponse<string>) => {
        this.isLoading.set(false);
        
        if (response.succeeded) {
          // AuthService automatically handles token storage and redirection
          this.router.navigate(['/Home']);
        } else {
          this.errorMessage.set(response.message || 'Login failed. Please try again.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    });
  }

  private markAllAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}