import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalInterceptor, MsalGuard, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { provideRouter, Routes } from '@angular/router';

// Ruta corregida según tu carpeta (src/app/msal-config.ts)
import { msalInstanceFactory, msalInterceptorConfigFactory } from './app/msal-config';

const routes: Routes = [
  // Aquí puedes agregar tus rutas o importar las de app.routes.ts
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    MsalGuard,
    MsalService,
    MsalBroadcastService
  ]
}).catch((err) => console.error(err));