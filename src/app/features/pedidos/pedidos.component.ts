import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../core/services/pedido.service';
import { ProductoService } from '../../core/services/producto.service';
import { Pedido, CrearPedidoRequest } from '../../core/models/pedido.model';
import { Producto } from '../../core/models/producto.model';
import { AuthService } from '../../core/auth/auth.service';
import { mensajeHttp } from '../../core/http-error';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoService = inject(ProductoService);
  readonly auth = inject(AuthService);

  pedidos: Pedido[] = [];
  productos: Producto[] = [];
  cargando = false;
  error = '';

  // Formulario simple de creacion
  clienteId = 1;
  direccionEntrega = '';
  productoSeleccionado?: number;
  cantidad = 1;
  carrito: CrearPedidoRequest['items'] = [];

  ngOnInit(): void {
    this.cargar();
    this.productoService.listar().subscribe({
      next: data => this.productos = data,
      error: err => console.error(err)
    });
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    // Admin ve todos los pedidos; un Cliente solo ve los suyos (email tomado del token)
    this.auth.rolesCargados().then(roles => {
      const origen = roles.includes('Admin') ? this.pedidoService.listar() : this.pedidoService.misPedidos();
      origen.subscribe({
        next: data => { this.pedidos = data; this.cargando = false; },
        error: err => { this.error = mensajeHttp(err, 'No se pudieron cargar los pedidos'); this.cargando = false; console.error(err); }
      });
    });
  }

  agregarAlCarrito(): void {
    const producto = this.productos.find(p => p.id === Number(this.productoSeleccionado));
    if (!producto) { this.error = 'Selecciona un producto'; return; }
    this.carrito.push({
      productoId: producto.id!,
      nombreProducto: producto.nombre,
      cantidad: this.cantidad,
      precioUnitario: producto.precio
    });
    this.cantidad = 1;
    this.error = '';
  }

  quitarDelCarrito(indice: number): void {
    this.carrito.splice(indice, 1);
  }

  get totalCarrito(): number {
    return this.carrito.reduce((suma, i) => suma + i.precioUnitario * i.cantidad, 0);
  }

  confirmarPedido(): void {
    if (!this.carrito.length) { this.error = 'El carrito esta vacio'; return; }

    const request: CrearPedidoRequest = {
      clienteId: this.clienteId,
      direccionEntrega: this.direccionEntrega,
      // clienteEmail no se envia: el backend lo toma del claim del token
      items: this.carrito
    };

    this.pedidoService.crear(request).subscribe({
      next: () => { this.carrito = []; this.direccionEntrega = ''; this.cargar(); },
      error: err => { this.error = mensajeHttp(err, 'Error al crear el pedido'); console.error(err); }
    });
  }

  cancelar(id?: number): void {
    if (!id) return;
    this.pedidoService.cancelar(id).subscribe({
      next: () => this.cargar(),
      error: err => { this.error = 'Error al cancelar el pedido'; console.error(err); }
    });
  }
}
