import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Permite entrar solo si el access token trae el rol "Admin". */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = await auth.rolesCargados();
  return roles.includes('Admin') ? true : router.createUrlTree(['/sin-permiso']);
};
