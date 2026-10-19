import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../core/services/pedido.service';
import { ProductoService } from '../../core/services/producto.service';
import { Pedido, CrearPedidoRequest, EstadoPedido } from '../../core/models/pedido.model';
import { ClienteService } from '../../core/services/cliente.service';
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
  private clienteService = inject(ClienteService);
  readonly auth = inject(AuthService);

  pedidos: Pedido[] = [];
  productos: Producto[] = [];
  cargando = false;
  error = '';

  /** Estados en los que el backend permite cancelar (misma regla que EstadoPedido.java). */
  private static readonly CANCELABLES: EstadoPedido[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION'];

  // Formulario simple de creacion. El clienteId se obtiene de /api/clientes/mi-perfil
  // (antes estaba fijo en 1 y todos los pedidos quedaban asociados al cliente 1).
  clienteId?: number;
  sinPerfil = false;
  direccionEntrega = '';
  productoSeleccionado?: number;
  cantidad = 1;
  carrito: CrearPedidoRequest['items'] = [];

  ngOnInit(): void {
    this.cargar();
    this.clienteService.miPerfil().subscribe({
      next: perfil => { this.clienteId = perfil.id; this.sinPerfil = false; },
      error: () => { this.clienteId = undefined; this.sinPerfil = true; }
    });
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
    if (!Number.isInteger(this.cantidad) || this.cantidad < 1) { this.error = 'La cantidad debe ser un entero mayor o igual a 1'; return; }
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
    if (!this.clienteId) { this.error = 'No tienes un perfil de cliente registrado (GET /api/clientes/mi-perfil respondio 404)'; return; }

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

  esCancelable(pedido: Pedido): boolean {
    return !!pedido.estado && PedidosComponent.CANCELABLES.includes(pedido.estado);
  }

  cancelar(id?: number): void {
    if (!id) return;
    this.pedidoService.cancelar(id).subscribe({
      next: () => this.cargar(),
      error: err => { this.error = mensajeHttp(err, 'Error al cancelar el pedido'); console.error(err); }
    });
  }
}
