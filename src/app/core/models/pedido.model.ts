export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'DESPACHADO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface DetallePedido {
  id?: number;
  productoId: number;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Pedido {
  id?: number;
  clienteId: number;
  clienteEmail?: string;
  fecha?: string;
  estado?: EstadoPedido;
  total?: number;
  direccionEntrega?: string;
  detalles: DetallePedido[];
}

/** Payload que espera el endpoint POST /api/pedidos */
export interface CrearPedidoRequest {
  clienteId: number;
  clienteEmail?: string;
  direccionEntrega?: string;
  items: {
    productoId: number;
    nombreProducto?: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}
