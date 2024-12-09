import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgendaService } from 'src/app/services/agenda.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnoService } from 'src/app/services/turno.service'; // Importa el servicio de turnos
import { EditarAgendaModalComponent } from '../editar-agenda-modal/editar-agenda-modal.component';
import { TurnosDialogComponent } from '../turnos-dialog/turnos-dialog.component';

@Component({
  selector: 'app-turnos-programados-operador',
  templateUrl: './turnos-programados-operador.component.html',
  styleUrls: ['./turnos-programados-operador.component.css']
})
export class TurnosProgramadosOperadorComponent implements OnInit {
  especialidades: any[] = [];
  medicosPorEspecialidad: any[] = [];
  fechaSeleccionada: string = "";

  constructor(
    private dialog: MatDialog,
    private agendaService: AgendaService,
    private especialidadService: EspecialidadService,
    private turnoService: TurnoService // Inyecta el servicio de turnos
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.fechaSeleccionada = today.toISOString().split('T')[0];
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.obtenerEspecialidades().subscribe(response => {
      if (response.codigo === 200) {
        this.especialidades = response.payload;
        this.cargarMedicosPorEspecialidad();
      } else {
        console.error(response.mensaje);
      }
    });
  }

  cargarMedicosPorEspecialidad(): void {
    this.medicosPorEspecialidad = []; // Clear previous data
    this.especialidades.forEach(especialidad => {
      this.especialidadService.obtenerMedicoPorEspecialidad(especialidad.id).subscribe(response => {
        if (response.codigo === 200 && response.payload.length > 0) {
          const medicos = response.payload.map((medico: any) => {
            return {
              ...medico,
              especialidad: especialidad.descripcion,
              horarioAtencion: ''
            };
          });
          this.medicosPorEspecialidad.push({
            especialidad: especialidad.descripcion,
            medicos: medicos
          });
          medicos.forEach((medico: any) => {
            this.obtenerHorarioAtencion(medico);
          });
        }
      });
    });
  }

  obtenerHorarioAtencion(medico: any): void {
    this.agendaService.obtenerAgenda(medico.id_medico.toString()).subscribe(response => {
      if (response.codigo === 200 && response.payload.length > 0) {
        const agendas = response.payload.filter((agenda: any) => {
          const agendaFecha = new Date(agenda.fecha).toISOString().split('T')[0];
          return agendaFecha === this.fechaSeleccionada;
        });
        if (agendas.length > 0) {
          const horarios = agendas.map((agenda: any) => ({
            entrada: new Date(`1970-01-01T${agenda.hora_entrada}:00`).getTime(),
            salida: new Date(`1970-01-01T${agenda.hora_salida}:00`).getTime()
          }));
          const horarioInicio = Math.min(...horarios.map((h: { entrada: number }) => h.entrada));
          const horarioFin = Math.max(...horarios.map((h: { salida: number }) => h.salida));
          medico.horarioAtencion = `${new Date(horarioInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(horarioFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
          medico.horarioAtencion = 'No disponible';
        }
      }
    });
  }

  cambiarFecha(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.value;
    this.cargarMedicosPorEspecialidad();
  }

  editarAgenda(medico: any): void {
    const dialogRef = this.dialog.open(EditarAgendaModalComponent, {
      width: '400px',
      data: { medico: medico }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Agenda editada para: ${medico.nombre}`, result);
        this.cargarMedicosPorEspecialidad();
      }
    });
  }

  verTurnos(medico: any): void {
    const body = { id_medico: medico.id_medico, fecha: this.fechaSeleccionada };
    const token = localStorage.getItem('token') || '';

    this.turnoService.obtenerTurnoMedico(body, token).subscribe(response => {
      if (response.codigo === 200) {
        console.log('Turnos obtenidos:', response.payload); // Verifica los turnos obtenidos
        const dialogRef = this.dialog.open(TurnosDialogComponent, {
          width: '400px',
          data: { turnos: response.payload, medico: medico, fecha: this.fechaSeleccionada }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('El diálogo de turnos se cerró');
        });
      } else {
        console.error('Error al obtener los turnos:', response.mensaje);
      }
    }, error => {
      console.error('Error en la petición', error);
    });
  }
}