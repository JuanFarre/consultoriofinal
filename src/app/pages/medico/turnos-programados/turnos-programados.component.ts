import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/services/turno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit {
  fechaSeleccionada: Date | null = null;
  turnos: any[] = [];
  turnosFiltrados: any[] = [];

  constructor(
    private turnoService: TurnoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // No cargar turnos inicialmente, ya que fechaSeleccionada es null
  }

  volver(): void {
    this.router.navigate(['/medico']);
  }

  seleccionarFecha(event: any): void {
    this.fechaSeleccionada = event.value;
    this.cargarTurnos();
  }

  cargarTurnos() {
    if (!this.fechaSeleccionada) {
      console.error('Fecha no seleccionada');
      return;
    }

    const fechaSeleccionadaString = this.fechaSeleccionada.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    const id_medico = datosUsuario.id || 0; // Obtener el id del médico logueado
    const body = { id_medico, fecha: fechaSeleccionadaString };

    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    console.log('Request Body:', body); // Verificar el cuerpo de la solicitud
    this.turnoService.obtenerTurnoMedico(body, token).subscribe(response => {
      console.log('API Response:', response); // Add this line to check the API response
      if (response.codigo === 200) {
        this.turnos = response.payload.map((turno: any) => ({
          hora: turno.hora,
          nombre: turno.nombre_paciente.split(', ')[1],
          apellido: turno.nombre_paciente.split(', ')[0],
          edad: this.calcularEdad(turno.fecha_nacimiento),
          nota: turno.nota
        }));
        console.log('Turnos:', this.turnos); // Check the mapped turnos
        this.filtrarTurnos();
      } else {
        console.error(response.mensaje);
      }
    }, error => {
      console.error('Error al obtener los turnos:', error);
    });
  }

  filtrarTurnos() {
    this.turnosFiltrados = this.turnos;
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  mostrarNotasTurno(turno: any): void {
    alert(`Notas del turno: ${turno.nota}`);
  }
}