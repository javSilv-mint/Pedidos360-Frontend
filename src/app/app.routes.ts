import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  {
    path: 'productos',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./features/productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'pedidos',
    canActivate: [MsalGuard],
    loadComponent: () =>
      import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent)
  },
  {
    path: 'clientes',
    canActivate: [MsalGuard, adminGuard],   // solo rol Admin
    loadComponent: () =>
      import('./features/clientes/clientes.component').then(m => m.ClientesComponent)
  },
  {
    path: 'monitoreo',
    canActivate: [MsalGuard, adminGuard],   // solo rol Admin
    loadComponent: () =>
      import('./features/monitoreo/monitoreo.component').then(m => m.MonitoreoComponent)
  },
  {
    path: 'sin-permiso',
    loadComponent: () =>
      import('./features/sin-permiso/sin-permiso.component').then(m => m.SinPermisoComponent)
  },

  { path: '**', redirectTo: 'productos' }
];
