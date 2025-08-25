// web/src/app/core/guards/reverse-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReverseAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

canActivate(): boolean | UrlTree {
  if (this.authService.isAuthenticated()) {
    return this.router.parseUrl('/home');
  }
  return true;
}
}