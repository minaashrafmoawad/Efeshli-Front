
import { inject } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const reverseAuthGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.parseUrl('/home') : true;
};