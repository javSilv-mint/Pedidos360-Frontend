import { 
  PublicClientApplication, 
  IPublicClientApplication,
  InteractionType, 
  BrowserCacheLocation, 
  Configuration 
} from '@azure/msal-browser';
import { 
  MsalGuardConfiguration, 
  MsalInterceptorConfiguration 
} from '@azure/msal-angular';
import { environment } from '../environments/environment';

export const msalConfig: Configuration = {
  auth: {
    // Toma automáticamente el Client ID '02281fe3-32a9-4667-91fc-50ece21860f1' desde environment.ts
    clientId: environment.azure.clientId,
    authority: environment.azure.authority,
    redirectUri: environment.azure.redirectUri,
    postLogoutRedirectUri: environment.azure.redirectUri
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
  }
};

export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { 
      scopes: ['user.read', ...environment.azure.protectedResourceScopes] 
    }
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      ['https://graph.microsoft.com/v1.0/me', ['user.read']],
      // Adjunta el token Bearer automáticamente en las peticiones HTTP a tu backend o API Gateway
      [environment.apiBaseUrl, environment.azure.protectedResourceScopes],
      ['https://*.execute-api.us-east-1.amazonaws.com', environment.azure.protectedResourceScopes]
    ])
  };
}
