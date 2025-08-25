// // web/src/app/core/guards/reverse-auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReverseAuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

// canActivate(): boolean | UrlTree {
//   if (this.authService.isAuthenticated()) {
//     return this.router.parseUrl('/home');
//   }
//   return true;
// }
// }

import { inject } from '@angular/core';
import { Router, type UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const reverseAuthGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.parseUrl('/home') : true;
};