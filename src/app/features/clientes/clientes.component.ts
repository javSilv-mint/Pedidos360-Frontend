import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/cliente.model';
import { mensajeHttp } from '../../core/http-error';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  private service = inject(ClienteService);

  clientes: Cliente[] = [];
  cargando = false;
  error = '';

  nuevo: Cliente = { rut: '', nombre: '', apellido: '', email: '', telefono: '', direccion: '' };

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.service.listar().subscribe({
      next: data => { this.clientes = data; this.cargando = false; },
      error: err => { this.error = mensajeHttp(err, 'No se pudieron cargar los clientes'); this.cargando = false; console.error(err); }
    });
  }

  guardar(): void {
    this.service.crear(this.nuevo).subscribe({
      next: () => {
        this.nuevo = { rut: '', nombre: '', apellido: '', email: '', telefono: '', direccion: '' };
        this.cargar();
      },
      error: err => { this.error = mensajeHttp(err, 'Error al crear el cliente'); console.error(err); }
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
