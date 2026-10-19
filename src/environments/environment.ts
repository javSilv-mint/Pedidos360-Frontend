// ===== Desarrollo local: cada microservicio en su puerto (ver README del backend) =====
export const environment = {
  production: false,

  apiProductos: 'http://localhost:8081/api/productos',
  apiPedidos: 'http://localhost:8082/api/pedidos',
  apiClientes: 'http://localhost:8083/api/clientes',
  // rabbit-lab (guia 2.2.3): publicador de eventos + monitoreo de cola/DLQ
  apiRabbitLab: 'http://localhost:8080/api',

  azure: {
    // Application (client) ID del registro SPA en Entra External ID
    clientId: '02281fe3-32a9-4667-91fc-50ece21860f1',

    // Tenant External ID (CIAM): el authority DEBE ser ciamlogin.com para que el
    // claim "iss" del token coincida con AZURE_ISSUER_URI que valida el backend.
    authority: 'https://ejemduoc123.ciamlogin.com/d24bf402-e7a2-4d9c-844f-18e7f6229529',
    knownAuthority: 'ejemduoc123.ciamlogin.com',

    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',

    // Scope delegado expuesto por el registro pedidos360-backend-api
    apiScope: 'api://b7415d24-0ba0-4650-8a44-e5830fb21eab/access_as_user'
  }
};
