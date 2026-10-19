import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication
} from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

/** Scopes que se piden al iniciar sesion y para llamar al backend. */
export const loginScopes = ['openid', 'profile', 'offline_access', environment.azure.apiScope];

/**
 * Instancia de MSAL. Usa Authorization Code Flow con PKCE (MSAL lo aplica
 * automaticamente para aplicaciones registradas como "Single-page application"),
 * e incluye state y nonce en cada solicitud de autorizacion.
 */
export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      knownAuthorities: [environment.azure.knownAuthority],
      redirectUri: environment.azure.redirectUri,
      postLogoutRedirectUri: environment.azure.postLogoutRedirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage
    },
    system: {
      loggerOptions: {
        logLevel: environment.production ? LogLevel.Warning : LogLevel.Info,
        piiLoggingEnabled: false,
        loggerCallback: (level, message) => {
          if (level === LogLevel.Error) console.error(message);
          else if (!environment.production) console.debug(message);
        }
      }
    }
  });
}

/** MsalGuard: si no hay sesion, redirige al login de Entra External ID. */
export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { scopes: loginScopes }
  };
}

/**
 * MsalInterceptor: adjunta "Authorization: Bearer <access_token>" SOLO a las
 * URLs del backend. El token es el ACCESS token del API (no el id_token).
 * El "*" final cubre /api/xxx, /api/xxx/{id} y rutas hijas.
 */
export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const scopes = [environment.azure.apiScope];
  const protectedResourceMap = new Map<string, string[]>([
    [`${environment.apiProductos}*`, scopes],
    [`${environment.apiPedidos}*`, scopes],
    [`${environment.apiClientes}*`, scopes],
    [`${environment.apiRabbitLab}*`, scopes]
  ]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
