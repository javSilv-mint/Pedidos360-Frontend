import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { loginScopes } from './msal.config';

/** Claims relevantes del access token emitido para el API. */
export interface ClaimsToken {
  roles?: string[];
  scp?: string;
  aud?: string;
  iss?: string;
  exp?: number;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private msal = inject(MsalService);
  private broadcast = inject(MsalBroadcastService);

  readonly cuenta = signal<AccountInfo | null>(null);
  readonly claims = signal<ClaimsToken | null>(null);

  readonly autenticado = computed(() => this.cuenta() !== null);
  readonly roles = computed(() => this.claims()?.roles ?? []);
  readonly scopes = computed(() => (this.claims()?.scp ?? '').split(' ').filter(s => s));
  readonly esAdmin = computed(() => this.roles().includes('Admin'));

  /** Se llama una vez desde AppComponent. */
  iniciar(): void {
    // Procesa la respuesta del redirect de login (code + state) al volver a la app
    this.msal.handleRedirectObservable().subscribe({
      next: resultado => {
        if (resultado?.account) this.msal.instance.setActiveAccount(resultado.account);
      },
      error: err => console.error('Error procesando el redirect de login', err)
    });

    this.broadcast.msalSubject$
      .pipe(filter((e: EventMessage) =>
        e.eventType === EventType.LOGIN_SUCCESS || e.eventType === EventType.LOGOUT_SUCCESS))
      .subscribe(() => this.sincronizar());

    // Cuando MSAL termina cualquier interaccion, actualizamos el estado de la sesion
    this.broadcast.inProgress$
      .pipe(filter(estado => estado === InteractionStatus.None))
      .subscribe(() => this.sincronizar());
  }

  login(): void {
    this.msal.loginRedirect({ scopes: loginScopes });
  }

  logout(): void {
    this.claims.set(null);
    this.cuenta.set(null);
    this.msal.logoutRedirect({
      account: this.msal.instance.getActiveAccount() ?? undefined,
      postLogoutRedirectUri: environment.azure.postLogoutRedirectUri
    });
  }

  /**
   * Espera a que MSAL no tenga interacciones en curso (p.ej. procesando el redirect)
   * y a que los roles esten cargados. Lo usan el guard de Admin y las vistas.
   */
  async rolesCargados(): Promise<string[]> {
    await firstValueFrom(this.broadcast.inProgress$.pipe(filter(e => e === InteractionStatus.None)));
    if (!this.claims()) await this.sincronizar();
    return this.roles();
  }

  private async sincronizar(): Promise<void> {
    const instancia = this.msal.instance;
    let activa = instancia.getActiveAccount();
    if (!activa && instancia.getAllAccounts().length > 0) {
      activa = instancia.getAllAccounts()[0];
      instancia.setActiveAccount(activa);
    }
    this.cuenta.set(activa);
    if (!activa) { this.claims.set(null); return; }

    try {
      // Los roles del API vienen en el ACCESS token, por eso lo pedimos (desde cache si existe)
      const resultado = await firstValueFrom(this.msal.acquireTokenSilent({
        scopes: [environment.azure.apiScope],
        account: activa
      }));
      this.claims.set(decodificarPayload(resultado.accessToken));
    } catch (err) {
      console.warn('No se pudo obtener el access token en silencio', err);
      this.claims.set(null);
    }
  }
}

/** Decodifica (sin validar) el payload de un JWT solo para mostrar datos en la UI. */
function decodificarPayload(token: string): ClaimsToken | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
