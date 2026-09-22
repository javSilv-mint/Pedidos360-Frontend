export const environment = {
  production: false,
  azure: {
    // ID de la aplicación de Frontend registrada en Azure (SPA)
    clientId: '02281fe3-32a9-4667-91fc-50ece21860f1',
    
    // ID de tu Inquilino / Directorio de Azure Entra ID
    tenantId: 'd24bf402-e7a2-4d9c-844f-18e7f6229529',
    
    // Endpoint de autenticación con tu Tenant ID
    authority: 'https://login.microsoftonline.com/d24bf402-e7a2-4d9c-844f-18e7f6229529',
    
    // URI a la que redirige tras autenticarse
    redirectUri: 'http://localhost:4200',
    
    // Ámbito (scope) expuesto por tu API Backend
    protectedResourceScopes: ['api://b7415d24-0ba0-4650-8a44-e5830fb21eab/.default']
  },
  // URL base de tu backend o API Gateway
  apiBaseUrl: 'http://localhost:8080'
};