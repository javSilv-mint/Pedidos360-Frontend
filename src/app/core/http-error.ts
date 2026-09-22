import { HttpErrorResponse } from '@angular/common/http';

/** Traduce los codigos HTTP de seguridad a mensajes claros para el usuario. */
export function mensajeHttp(err: unknown, porDefecto: string): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 401) return '401: sesion expirada o token invalido. Vuelve a iniciar sesion.';
    if (err.status === 403) return '403: tu usuario no tiene permisos para esta accion.';
    if (err.status === 0) return 'No hay conexion con el backend (revisa URL, CORS o API Gateway).';
    const mensaje = (err.error as { mensaje?: string } | null)?.mensaje;
    if (mensaje) return `${err.status}: ${mensaje}`;
  }
  return porDefecto;
}
