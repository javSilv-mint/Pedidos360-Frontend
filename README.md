# Pedidos360 — Frontend (DSY1107 · Desarrollo Cloud Native I)

Angular 21 (standalone) + **MSAL** (`@azure/msal-angular` 6 / `@azure/msal-browser` 5) contra **Microsoft Entra External ID**.

## Qué implementa

- Login y logout con **Authorization Code Flow + PKCE** (redirect), incluyendo `state` y `nonce`.
- `MsalGuard` en todas las vistas y `adminGuard` (rol `Admin`) en **Clientes**.
- `MsalInterceptor` adjunta el **access token** del API (scope `api://<API>/access_as_user`) solo a las URLs del backend / API Gateway.
- `AuthService` lee `roles` y `scp` desde los claims del access token y adapta la UI:
  un Admin ve todos los pedidos y puede crear o eliminar productos; un Cliente ve solo sus pedidos.
- Mensajes claros para respuestas 401 / 403 / errores de conexión.

## Configuración

- `src/environments/environment.ts`: desarrollo (llama directo a `localhost:8081-8083`).
- `src/environments/environment.prod.ts`: producción (todo pasa por AWS API Gateway). `ng build` lo aplica automáticamente.

Campos de `azure`: `clientId` (app SPA), `authority` (`https://<SUBDOMINIO>.ciamlogin.com/`),
`knownAuthority`, `redirectUri`, `postLogoutRedirectUri`, `apiScope`.

> En el repositorio los valores quedan como placeholders.

## Comandos

```bash
npm install
npx ng serve                 # http://localhost:4200
npx ng build                 # dist/pedidos360-frontend/browser  (producción)
```

Requiere Node.js 20.19+, 22.12+ o 24+.

## Despliegue

Subir el contenido de `dist/pedidos360-frontend/browser` a S3 detrás de CloudFront (HTTPS, páginas de error 403/404 → `/index.html` con código 200),
o a Azure Static Web Apps (`public/staticwebapp.config.json` ya incluye el fallback de rutas).
La URL HTTPS final debe registrarse como Redirect URI de la app SPA y como origen CORS en API Gateway.
