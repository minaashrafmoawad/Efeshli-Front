import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;   
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5104/api/Auth'; // backend base URL

  constructor(private http: HttpClient) {}

  register(model: RegisterDto): Observable<string> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, model)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          return response.token;
        })
      );
  }

  login(model: LoginDto): Observable<string> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, model)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          return response.token;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return '';
  }
}
