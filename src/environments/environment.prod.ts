// ===== Produccion: todo pasa por AWS API Gateway =====
// Reemplaza <TU-API-ID> por la "Invoke URL" del Stage de tu API Gateway.
// Las rutas del Gateway deben reenviar /api/productos|pedidos|clientes al microservicio correspondiente.
const gateway = 'https://<TU-API-ID>.execute-api.us-east-1.amazonaws.com';

export const environment = {
  production: true,

  apiProductos: `${gateway}/api/productos`,
  apiPedidos: `${gateway}/api/pedidos`,
  apiClientes: `${gateway}/api/clientes`,
  // Ruta del Gateway hacia el servicio de mensajeria (ajustar cuando se despliegue)
  apiRabbitLab: `${gateway}/rabbit-lab/api`,

  azure: {
    clientId: '02281fe3-32a9-4667-91fc-50ece21860f1',
    authority: 'https://ejemduoc123.ciamlogin.com/d24bf402-e7a2-4d9c-844f-18e7f6229529',
    knownAuthority: 'ejemduoc123.ciamlogin.com',

    // El origen real del despliegue (CloudFront/S3). Debe estar registrado como
    // Redirect URI de tipo SPA en Entra ID, o el login falla con AADSTS50011.
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,

    apiScope: 'api://b7415d24-0ba0-4650-8a44-e5830fb21eab/access_as_user'
  }
};
