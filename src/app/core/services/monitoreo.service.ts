import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonitoreoColas, PedidoEventoRequest } from '../models/monitoreo.model';

/** Cliente del rabbit-lab. MsalInterceptor adjunta el Bearer porque la URL esta en protectedResourceMap. */
@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiRabbitLab;

  estadoColas(): Observable<MonitoreoColas> {
    return this.http.get<MonitoreoColas>(`${this.baseUrl}/monitoreo/colas`);
  }

  publicarEvento(request: PedidoEventoRequest): Observable<{ estado: string }> {
    return this.http.post<{ estado: string }>(`${this.baseUrl}/pedidos/eventos`, request);
  }
}
