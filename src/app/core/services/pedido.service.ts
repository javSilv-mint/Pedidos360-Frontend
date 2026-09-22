import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, CrearPedidoRequest, EstadoPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiPedidos;

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  listarPorCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl, {
      params: { clienteId: clienteId.toString() }
    });
  }

  /** Pedidos del usuario autenticado (el backend toma el email del token). */
  misPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/mis-pedidos`);
  }

  listarPorEmail(email: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/por-email`, { params: { email } });
  }

  crear(request: CrearPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, request);
  }

  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${id}/estado`, null, {
      params: { estado }
    });
  }

  cancelar(id: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${id}/cancelar`, null);
  }
}
