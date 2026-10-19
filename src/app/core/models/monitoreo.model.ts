/** Espejo de cl.duoc.lab.monitoreo.ColaEstado */
export interface ColaEstado {
  nombre: string;
  existe: boolean;
  mensajes: number;
  consumidores: number;
}

/** Espejo de cl.duoc.lab.monitoreo.MonitoreoColas (GET /api/monitoreo/colas) */
export interface MonitoreoColas {
  principal: ColaEstado;
  dlq: ColaEstado;
  alerta: boolean;
  umbralAlerta: number;
  fecha: string;
}

export type TipoEvento = 'CREADO' | 'PAGADO' | 'CANCELADO';

/** Espejo de cl.duoc.lab.pedidos.PedidoEventoRequest */
export interface PedidoEventoRequest {
  pedidoId: number;
  tipo: TipoEvento;
  emailCliente: string;
}

/**
 * Escenarios de la demo. El email activa el fallo simulado en InventarioProcesador
 * (error-permanente / reintento-agotado / reintento-ok).
 */
export interface EscenarioDemo {
  clave: string;
  etiqueta: string;
  email: string;
  esperado: string;
}

export const ESCENARIOS_DEMO: EscenarioDemo[] = [
  { clave: 'ok', etiqueta: 'Exito', email: 'cliente@demo.cl', esperado: 'ACK al primer intento' },
  { clave: 'recupera', etiqueta: 'Falla y se recupera', email: 'reintento-ok@demo.cl', esperado: 'ACK en el intento 3 (backoff 1s, 2s)' },
  { clave: 'agotado', etiqueta: 'Reintentos agotados', email: 'reintento-agotado@demo.cl', esperado: 'NACK tras 3 intentos -> DLQ' },
  { clave: 'permanente', etiqueta: 'Error no recuperable', email: 'error-permanente@demo.cl', esperado: 'NACK inmediato -> DLQ (sin reintentos)' }
];
