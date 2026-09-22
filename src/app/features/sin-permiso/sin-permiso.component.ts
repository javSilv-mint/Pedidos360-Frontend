import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sin-permiso',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Acceso denegado (403)</h2>
    <p>Tu usuario no tiene el rol <strong>Admin</strong> requerido para esta vista.</p>
    <a routerLink="/productos">Volver a productos</a>
  `
})
export class SinPermisoComponent {}
