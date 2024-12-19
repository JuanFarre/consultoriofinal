import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const url = state.url;

  const rutasPorRol: { [key: string]: string } = {
    admin: '/admin',
    medico: '/medico',
    operador: '/operador',
    paciente: '/pacientes',
  };

  const rutasPermitidas: { [key: string]: string[] } = {
    admin: ['/admin'],
    medico: ['/medico', '/medico/turnos-programados', '/medico/gestion-agenda'],
    operador: ['/operador', '/operador/turnos-programados-operador', '/operador/registrar-pacientes'],
    paciente: ['/pacientes', '/pacientes/nuevo-turno', '/pacientes/mis-datos', '/pacientes/mis-turnos'],
  };

  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        const rol = authService.getUserRole(); // Get the user's role
        console.log(`Rol del usuario: ${rol}`); // Log the user's role
        console.log(`URL solicitada: ${url}`); // Log the requested URL
        if (rutasPermitidas[rol]?.includes(url)) {
          return true;
        } else {
          console.log(`Acceso denegado para rol: ${rol}`);
          alert('No tiene permiso para acceder a esta página.');
          router.navigate([rutasPorRol[rol]]);
          return false;
        }
      } else {
        router.navigate(['/welcome']);
        return false;
      }
    })
  );
};