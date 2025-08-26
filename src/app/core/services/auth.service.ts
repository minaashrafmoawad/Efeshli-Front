// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

// Declare Google and Facebook types
declare var google: any;
declare var FB: any;

export interface OAuthRegisterRequest {
  provider: 'Google' | 'Facebook';
  providerKey: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  accessToken: string;
}

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
    // Facebook initialization state
    private isFacebookInitialized = false;
  private facebookInitPromise: Promise<void> | null = null;
  private facebookInitInProgress = false;

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
  login(credentials: LoginRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/login`, credentials)
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
      
      // Handle different claim formats
      const nameIdentifier = payload.sub || 
                           payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      const emailClaim = payload.email || 
                        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      
      // Handle roles
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
        roles: roles.filter(role => !!role)
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
   * Refresh token
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

  /**
   * OAuth registration
   */
  oauthRegister(request: OAuthRegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/oauth/register`, request)
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
   * OAuth login
   */
  oauthLogin(request: OAuthRegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/oauth/login`, request)
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
   * Initialize Google OAuth
   */
  initializeGoogleOAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleSDK().then(() => {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: (environment as any).googleClientId,
            callback: this.handleGoogleCredentialResponse.bind(this)
          });
        }
      });
    }
  }

  /**
   * Initialize Facebook OAuth
   */
  // initializeFacebookOAuth(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.loadFacebookSDK().then(() => {
  //       if (typeof FB !== 'undefined') {
  //         FB.init({
  //           appId: (environment as any).facebookAppId,
  //           cookie: true,
  //           xfbml: true,
  //           version: 'v18.0'
  //         });
  //       }
  //     });
  //   }
  // }
 /**
   * Facebook OAuth login
   */
  // facebookLogin(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (!isPlatformBrowser(this.platformId)) {
  //       reject(new Error('Not in browser environment'));
  //       return;
  //     }

  //     if (typeof FB === 'undefined') {
  //       reject(new Error('Facebook SDK not loaded'));
  //       return;
  //     }

  //     FB.login((response: any) => {
  //       if (response.authResponse) {
  //         this.handleFacebookAuthResponse(response.authResponse);
  //         resolve(response);
  //       } else {
  //         reject(new Error('User cancelled login or did not fully authorize.'));
  //       }
  //     }, { scope: 'email,public_profile' });
  //   });
  // }


 initializeFacebookOAuth(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('Not in browser environment'));
    }

    // If already initialized, return resolved promise
    if (this.isFacebookInitialized) {
      return Promise.resolve();
    }

    // If initialization is in progress, return the existing promise
    if (this.facebookInitPromise) {
      return this.facebookInitPromise;
    }

    this.facebookInitInProgress = true;
    this.facebookInitPromise = new Promise<void>((resolve, reject) => {
      // Check if FB is already available (might be loaded by another script)
      if (typeof FB !== 'undefined') {
        this.initializeFBSDK().then(resolve).catch(reject);
        return;
      }

      // Load Facebook SDK
      this.loadFacebookSDK()
        .then(() => this.initializeFBSDK())
        .then(resolve)
        .catch(reject);
    });

    return this.facebookInitPromise;
  }

  /**
   * Initialize Facebook SDK after loading
   */
  private initializeFBSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof FB === 'undefined') {
        reject(new Error('Facebook SDK not available'));
        return;
      }

      try {
        FB.init({
          appId: (environment as any).facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        
        this.isFacebookInitialized = true;
        this.facebookInitInProgress = false;
        resolve();
      } catch (error) {
        this.facebookInitInProgress = false;
        reject(error);
      }
    });
  }

  /**
   * Facebook OAuth login with proper initialization handling
   */
  async facebookLogin(): Promise<any> {
    try {
      // Ensure Facebook SDK is initialized
      await this.initializeFacebookOAuth();
      
      return new Promise((resolve, reject) => {
        if (typeof FB === 'undefined') {
          reject(new Error('Facebook SDK not loaded'));
          return;
        }

        FB.login((response: any) => {
          if (response.authResponse) {
            this.handleFacebookAuthResponse(response.authResponse)
              .then(() => resolve(response))
              .catch(reject);
          } else {
            if (response.status === 'not_authorized') {
              reject(new Error('User did not authorize the app'));
            } else {
              reject(new Error('User cancelled login'));
            }
          }
        }, { scope: 'email,public_profile' });
      });
    } catch (error) {
      console.error('Facebook login initialization error:', error);
      throw error;
    }
  }

  /**
   * Load Facebook SDK with proper error handling
   */
  private loadFacebookSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof FB !== 'undefined') {
        resolve();
        return;
      }

      // Check if already loading
      if (document.querySelector('script[src*="facebook.net"]')) {
        // Wait for existing script to load
        const checkInterval = setInterval(() => {
          if (typeof FB !== 'undefined') {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Facebook SDK loading timeout'));
        }, 10000);
        return;
      }

      // Load the SDK
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.id = 'facebook-jssdk';
      
      script.onload = () => {
        // Facebook SDK loads but might not be immediately available
        const checkFB = setInterval(() => {
          if (typeof FB !== 'undefined') {
            clearInterval(checkFB);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkFB);
          reject(new Error('FB object not available after script load'));
        }, 10000);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK'));
      };
      
      document.head.appendChild(script);
    });
  }






  /**
   * Google OAuth login
   */
  googleLogin(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        reject(new Error('Not in browser environment'));
        return;
      }

      if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
        reject(new Error('Google SDK not loaded'));
        return;
      }

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const buttonContainer = document.getElementById('google-login-button');
          if (buttonContainer) {
            google.accounts.id.renderButton(buttonContainer, { 
              theme: 'outline', 
              size: 'large',
              width: 240
            });
          }
        }
        resolve();
      });
    });
  }

 
  private async handleGoogleCredentialResponse(response: any): Promise<void> {
    try {
      if (!response || !response.credential) {
        throw new Error('Invalid Google response');
      }

      const credential = response.credential;
      const payload = this.decodeJWT(credential);
      
      if (!payload || !payload.sub || !payload.email) {
        throw new Error('Invalid Google token payload');
      }

      const oauthRequest: OAuthRegisterRequest = {
        provider: 'Google',
        providerKey: payload.sub,
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        phoneNumber: '',
        accessToken: credential
      };

      this.oauthLogin(oauthRequest).subscribe({
        error: (error) => {
          if (error.status === 404) {
            this.promptForPhoneNumber(oauthRequest);
          }
        }
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
    }
  }

  private async handleFacebookAuthResponse(authResponse: any): Promise<void> {
    try {
      const userInfo = await this.getFacebookUserInfo(authResponse.accessToken);
      
      const oauthRequest: OAuthRegisterRequest = {
        provider: 'Facebook',
        providerKey: authResponse.userID,
        email: userInfo.email,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        phoneNumber: '',
        accessToken: authResponse.accessToken
      };

      this.oauthLogin(oauthRequest).subscribe({
        error: (error) => {
          if (error.status === 404) {
            this.promptForPhoneNumber(oauthRequest);
          }
        }
      });
    } catch (error) {
      console.error('Facebook OAuth error:', error);
    }
  }

  private async getFacebookUserInfo(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof FB === 'undefined') {
        reject(new Error('Facebook SDK not loaded'));
        return;
      }

      FB.api('/me', { fields: 'id,email,first_name,last_name', access_token: accessToken }, 
        (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  private promptForPhoneNumber(oauthRequest: OAuthRegisterRequest): void {
    const phoneNumber = prompt('Please enter your phone number:');
    if (phoneNumber && this.validatePhoneNumber(phoneNumber)) {
      oauthRequest.phoneNumber = phoneNumber;
      this.oauthRegister(oauthRequest).subscribe();
    } else {
      alert('Valid phone number is required for registration.');
    }
  }

  private validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  }

  private decodeJWT(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      throw new Error('Invalid JWT token');
    }
  }

  private loadGoogleSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        resolve();
        return;
      }

      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const checkInterval = setInterval(() => {
          if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Google SDK loading timeout'));
        }, 5000);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const checkGoogle = setInterval(() => {
          if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            clearInterval(checkGoogle);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkGoogle);
          reject(new Error('Google object not available after script load'));
        }, 5000);
      };
      script.onerror = () => reject(new Error('Failed to load Google SDK'));
      document.head.appendChild(script);
    });
  }

  // private loadFacebookSDK(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     if (typeof FB !== 'undefined') {
  //       resolve();
  //       return;
  //     }

  //     if (document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]')) {
  //       const checkInterval = setInterval(() => {
  //         if (typeof FB !== 'undefined') {
  //           clearInterval(checkInterval);
  //           resolve();
  //         }
  //       }, 100);
        
  //       setTimeout(() => {
  //         clearInterval(checkInterval);
  //         reject(new Error('Facebook SDK loading timeout'));
  //       }, 5000);
  //       return;
  //     }

  //     const script = document.createElement('script');
  //     script.src = 'https://connect.facebook.net/en_US/sdk.js';
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = () => {
  //       const checkFB = setInterval(() => {
  //         if (typeof FB !== 'undefined') {
  //           clearInterval(checkFB);
  //           resolve();
  //         }
  //       }, 100);
        
  //       setTimeout(() => {
  //         clearInterval(checkFB);
  //         reject(new Error('Facebook object not available after script load'));
  //       }, 5000);
  //     };
  //     script.onerror = () => reject(new Error('Failed to load Facebook SDK'));
  //     document.head.appendChild(script);
  //   });
  // }
}