// ===== Producción: todo pasa por AWS API Gateway (HTTP API) =====
// Reemplaza esta URL con la "Invoke URL" que copiaste de tu AWS API Gateway Stage
const gateway = 'https://<TU-API-ID>.execute-api.us-east-1.amazonaws.com';

export const environment = {
  production: true,

  apiProductos: `${gateway}/v1/datos`,
  apiPedidos: `${gateway}/api/pedidos`,
  apiClientes: `${gateway}/api/clientes`,

  azure: {
    // Id. de aplicación (cliente) de AplicacionEjemploCloudNative1 (SPA)
    clientId: '02281fe3-32a9-4667-91fc-50ece21860f1',
    
    // Authority con tu Id. de directorio (inquilino)
    authority: 'https://login.microsoftonline.com/d24bf402-e7a2-4d9c-844f-18e7f6229529',
    knownAuthority: 'login.microsoftonline.com',
    
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    
    // Scope expuesto por el backend pedidos360-backend-api
    apiScope: 'api://b7415d24-0ba0-4650-8a44-e5830fb21eab/access_as_user'
  }
};