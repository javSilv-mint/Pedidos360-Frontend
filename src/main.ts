import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Unico punto de configuracion: rutas, HttpClient, MSAL (instancia, guard e interceptor)
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
