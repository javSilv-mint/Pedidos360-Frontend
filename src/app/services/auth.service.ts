import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalService = inject(MsalService);

  public cuenta = signal<AccountInfo | null>(null);
  public autenticado = computed(() => this.cuenta() !== null);
  
  public roles = computed<string[]>(() => {
    const claims = this.cuenta()?.idTokenClaims as { roles?: string[] } | undefined;
    return claims?.roles || [];
  });

  public esAdmin = computed(() => this.roles().includes('Admin'));

  constructor() {
    this.obtenerCuentaActiva();
  }

  private obtenerCuentaActiva(): void {
    const cuentas = this.msalService.instance.getAllAccounts();
    if (cuentas.length > 0) {
      this.cuenta.set(cuentas[0]);
    } else {
      this.cuenta.set(null);
    }
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }
}