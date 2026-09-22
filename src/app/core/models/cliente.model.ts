export interface Cliente {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}
