// // web/src/app/core/services/auth.service.ts
// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { environment } from '../../../environments/environment';

// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   roles: string[];
// }

// export interface ApiResponse<T = any> {
//   statusCode: number;
//   succeeded: boolean;
//   message: string;
//   errors: string[] | null;
//   data: T;
// }

// export interface LoginResponse {
//   token: string;
// }

// export interface RegisterResponse {
//   message: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface RegisterRequest {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface ForgotPasswordRequest {
//   email: string;
// }

// export interface ResetPasswordRequest {
//   email: string;
//   token: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private readonly apiUrl = `${environment.apiUrl}/auth`;
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.initializeAuthState();
//   }

//   private initializeAuthState(): void {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const user = this.decodeToken(token);
//       this.currentUserSubject.next(user);
//     }
//   }

//   login(credentials: LoginRequest): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(`${this.apiUrl}/login`, credentials)
//       .pipe(
//         tap(response => {
//           if (response.succeeded && response.data) {
//             this.setAuthState(response.data); // response.data contains the token
//           }
//         })
//       );
//   }

//   register(userData: RegisterRequest): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, userData);
//   }

//   forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<Boolean>> {
//    return  this.http.post<ApiResponse<Boolean>>(`${this.apiUrl}/forgot-password`, request);
//   }

//   resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
//     return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reset-password`, request);
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     this.currentUserSubject.next(null);
//   }

//   isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');
//     if (!token) return false;
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.exp * 1000 > Date.now();
//     } catch (e) {
//       return false;
//     }
//   }

//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   private setAuthState(token: string): void {
//     localStorage.setItem('token', token);
//     const user = this.decodeToken(token);
//     this.currentUserSubject.next(user);
//   }

//   private decodeToken(token: string): User {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return {
//         id: payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
//         email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
//         firstName: payload.given_name || payload.fullName?.split(' ')[0] || '',
//         lastName: payload.family_name || payload.fullName?.split(' ')[1] || '',
//         roles: Array.isArray(payload.role) ? payload.role : [payload.role].filter(Boolean) || []
//       };
//     } catch (e) {
//       console.error('Failed to decode token:', e);
//       return {
//         id: '',
//         email: '',
//         firstName: '',
//         lastName: '',
//         roles: []
//       };
//     }
//   }


  
// }

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

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
  private tokenExpirationTimer: any = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from stored token
   */
  private initializeAuthState(): void {
    // Only run in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = this.storageService.getItem('token');
      if (token && this.validateToken(token)) {
        const user = this.decodeToken(token);
        this.currentUserSubject.next(user);
        this.setAutoLogout(token);
      }
    }
  }

  /**
   * Login user and set authentication state
   */
  login(credentials: LoginRequest): Observable<ApiResponse<string >> {
    return this.http.post<ApiResponse<string >>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            if (response.succeeded && response.data) {
              this.setAuthState(response.data);
            }
          },
          error: (error) => {
            this.clearAuthState();
          }
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, userData);
  }

  /**
   * Request password reset
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/forgot-password`, request);
  }

  /**
   * Reset password with token
   */
  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reset-password`, request);
  }

  /**
   * Logout user and clear authentication state
   */
  logout(): void {
    this.clearAuthState();
    
    // Optional: Call server-side logout if needed
    // this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = this.storageService.getItem('token');
    return this.validateToken(token);
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  /**
   * Set authentication state from token
   */
  private setAuthState(token: string): void {
    this.storageService.setItem('token', token);
    debugger
    const user = this.decodeToken(token);
    this.currentUserSubject.next(user);
    
    this.setAutoLogout(token);
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.storageService.removeItem('token');
    this.currentUserSubject.next(null);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /**
   * Validate token structure and expiration
   */
  private validateToken(token: string | null): boolean {
    if (!token) return false;
    
    try {
      const payload = this.getTokenPayload(token);
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  /**
   * Set automatic logout timer based on token expiration
   */
  private setAutoLogout(token: string): void {
    // Clear any existing timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    try {
      const payload = this.getTokenPayload(token);
      const expiresIn = (payload.exp * 1000) - Date.now();
      
      // Logout 1 minute before token expiration for safety
      const logoutTime = Math.max(0, expiresIn - 60000);
      
      if (logoutTime > 0) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
          // You could emit an event or show a notification here
        }, logoutTime);
      }
    } catch (e) {
      console.error('Failed to set auto-logout timer:', e);
    }
  }

  /**
   * Extract payload from JWT token
   */
  private getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Decode token and extract user information
   */
  private decodeToken(token: string): User {
    try {
      const payload = this.getTokenPayload(token);
      
      // Handle different claim formats (standard vs. .NET specific)
      const nameIdentifier = payload.sub || 
                           payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      const emailClaim = payload.email || 
                        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      
      // Handle roles (could be string, array, or in specific claim)
      let roles: string[] = [];
      if (payload.role) {
        roles = Array.isArray(payload.role) ? payload.role : [payload.role];
      } else if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      }
      
      // Handle name extraction
      const fullNameParts = (payload.name || payload.fullName || '').split(' ');
      
      return {
        id: nameIdentifier || '',
        email: emailClaim || '',
        firstName: payload.given_name || payload.firstName || fullNameParts[0] || '',
        lastName: payload.family_name || payload.lastName || fullNameParts.slice(1).join(' ') || '',
        roles: roles.filter(role => !!role) // Remove any empty roles
      };
    } catch (e) {
      console.error('Failed to decode token:', e);
      return this.getNullUser();
    }
  }

  /**
   * Return empty user object
   */
  private getNullUser(): User {
    return { 
      id: '', 
      email: '', 
      firstName: '', 
      lastName: '', 
      roles: [] 
    };
  }

  /**
   * Refresh token (if your API supports it)
   */
  refreshToken(): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.apiUrl}/refresh`, {})
      .pipe(
        tap({
          next: (response) => {
            if (response.succeeded && response.data?.token) {
              this.setAuthState(response.data.token);
            }
          },
          error: (error) => {
            this.clearAuthState();
          }
        })
      );
  }
}