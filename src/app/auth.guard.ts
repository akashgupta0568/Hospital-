import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const email = localStorage.getItem('Email');
  const password = localStorage.getItem('Password'); // Example check
  const router = inject(Router);
  if (email && password) {
    return true; // Allow access if user is authenticated
  } else {
    router.navigate(['/']);
    return false; // Redirect to login if not authenticated
  }
};
