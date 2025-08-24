// web/src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface ApiResponse<T = any> {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: T;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.succeeded && response.data) {
            this.setAuthState(response.data); // response.data contains the token
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<Boolean>> {
   return  this.http.post<ApiResponse<Boolean>>(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reset-password`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthState(token: string): void {
    localStorage.setItem('token', token);
    const user = this.decodeToken(token);
    this.currentUserSubject.next(user);
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        firstName: payload.given_name || payload.fullName?.split(' ')[0] || '',
        lastName: payload.family_name || payload.fullName?.split(' ')[1] || '',
        roles: Array.isArray(payload.role) ? payload.role : [payload.role].filter(Boolean) || []
      };
    } catch (e) {
      console.error('Failed to decode token:', e);
      return {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        roles: []
      };
    }
  }


  
}