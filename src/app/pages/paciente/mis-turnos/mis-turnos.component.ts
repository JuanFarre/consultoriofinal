import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  turnos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTurnos();
  }

  obtenerTurnos(): void {
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    const idPaciente = datosUsuario.id || 0;
    const token = localStorage.getItem('token'); // Obtén el token desde el almacenamiento local

    if (!token) {
      console.error('Token no proporcionado');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:4000/api/obtenerTurnoPaciente/${idPaciente}`, { headers })
      .subscribe((response: any) => {
        console.log(response); // Agrega este console.log para verificar la respuesta
        if (response.codigo === 200) {
          this.turnos = response.payload.sort((a: any, b: any) => {
            const dateA = new Date(a.fecha + 'T' + a.hora);
            const dateB = new Date(b.fecha + 'T' + b.hora);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          console.error(response.mensaje);
        }
      });
  }

  volver(): void {
    this.router.navigate(['/pacientes']);
  }
}