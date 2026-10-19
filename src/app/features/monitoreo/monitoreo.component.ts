import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { catchError, of, switchMap, timer } from 'rxjs';
import { MonitoreoService } from '../../core/services/monitoreo.service';
import { ESCENARIOS_DEMO, EscenarioDemo, MonitoreoColas } from '../../core/models/monitoreo.model';
import { mensajeHttp } from '../../core/http-error';

interface EventoEnviado {
  pedidoId: number;
  escenario: string;
  esperado: string;
  hora: Date;
}

/**
 * Guia 2.2.3 en Angular: a diferencia del ejemplo React (que simula el resultado
 * con Math.random), aqui los contadores son REALES: vienen del broker via
 * RabbitAdmin (GET /api/monitoreo/colas) cada 5 segundos.
 */
@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
  private static readonly INTERVALO_MS = 5000;

  private service = inject(MonitoreoService);
  private destroyRef = inject(DestroyRef);

  readonly escenarios = ESCENARIOS_DEMO;
  readonly estado = signal<MonitoreoColas | null>(null);
  readonly error = signal('');
  readonly enviados = signal<EventoEnviado[]>([]);

  ngOnInit(): void {
    timer(0, MonitoreoComponent.INTERVALO_MS)
      .pipe(
        switchMap(() => this.service.estadoColas().pipe(
          catchError(err => {
            this.error.set(mensajeHttp(err, 'No se pudo consultar el estado de las colas'));
            return of(null);
          })
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(resultado => {
        if (resultado) {
          this.estado.set(resultado);
          this.error.set('');
        }
      });
  }

  enviar(escenario: EscenarioDemo): void {
    const pedidoId = Date.now();
    this.service.publicarEvento({ pedidoId, tipo: 'CREADO', emailCliente: escenario.email }).subscribe({
      next: () => this.enviados.update(lista =>
        [{ pedidoId, escenario: escenario.etiqueta, esperado: escenario.esperado, hora: new Date() }, ...lista].slice(0, 20)),
      error: err => this.error.set(mensajeHttp(err, 'No se pudo publicar el evento'))
    });
  }
}
