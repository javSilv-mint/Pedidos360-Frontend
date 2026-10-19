import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';
import { mensajeHttp } from '../../core/http-error';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  private service = inject(ProductoService);
  readonly auth = inject(AuthService);

  productos: Producto[] = [];
  cargando = false;
  error = '';

  nuevo: Producto = { nombre: '', precio: 0, stock: 0, categoria: '' };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.service.listar().subscribe({
      next: data => { this.productos = data; this.cargando = false; },
      error: err => { this.error = mensajeHttp(err, 'No se pudieron cargar los productos'); this.cargando = false; console.error(err); }
    });
  }

  guardar(): void {
    if (!this.nuevo.nombre || this.nuevo.precio <= 0) {
      this.error = 'Nombre y precio son obligatorios';
      return;
    }
    this.service.crear(this.nuevo).subscribe({
      next: () => {
        this.nuevo = { nombre: '', precio: 0, stock: 0, categoria: '' };
        this.cargar();
      },
      error: err => { this.error = mensajeHttp(err, 'Error al crear el producto'); console.error(err); }
    });
  }

  eliminar(id?: number): void {
    if (!id) return;
    this.service.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: err => { this.error = mensajeHttp(err, 'Error al eliminar'); console.error(err); }
    });
  }
}
