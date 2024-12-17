import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { Router } from '@angular/router';
import { Turno } from 'src/app/interfaces/turno';
import { MatDialog } from '@angular/material/dialog';
import { TurnoConfirmadoDialogComponent } from './turno-confirmado-dialog/turno-confirmado-dialog.component';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  cobertura: number = 0;
  especialidad: number = 0;
  profesional: number = 0;
  fecha: string = '';
  hora: string = '';
  notas: string = '';
  showModal: boolean = false;
  coberturas: any[] = [];
  especialidades: any[] = [];
  profesionales: any[] = [];
  horariosDisponibles: string[] = [];
  profesionalNombre: string = '';
  id_agenda: number = 0; // Placeholder value, replace with actual logic to get id_agenda
  id_paciente: number = 0; // Initialize to 0

  constructor(
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private agendaService: AgendaService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarCoberturas();
    this.cargarEspecialidades();
    this.obtenerIdPaciente();
    this.obtenerCoberturaUsuario(); // Obtener la cobertura del usuario
  }

  obtenerIdPaciente() {
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    this.id_paciente = datosUsuario.id || 0;
  }

  obtenerCoberturaUsuario() {
    const idCobertura = localStorage.getItem('id_cobertura');
    this.cobertura = idCobertura ? parseInt(idCobertura, 10) : 0; // Asigna la cobertura del usuario
  }

  cargarCoberturas() {
    this.especialidadService.obtenerCoberturas().subscribe(response => {
      if (response.codigo === 200) {
        this.coberturas = response.payload;
      } else {
        console.error(response.mensaje);
      }
    });
  }

  cargarEspecialidades() {
    this.especialidadService.obtenerEspecialidades().subscribe(response => {
      if (response.codigo === 200) {
        this.especialidades = response.payload;
      } else {
        console.error(response.mensaje);
      }
    });
  }

  getCoberturaNombre(): string {
    const cobertura = this.coberturas.find(c => c.id === this.cobertura);
    return cobertura ? cobertura.nombre : '';
  }

  onEspecialidadChange() {
    const id_especialidad = this.especialidad;
    this.especialidadService.obtenerMedicoPorEspecialidad(id_especialidad).subscribe(response => {
      if (response.codigo === 200) {
        this.profesionales = response.payload;
      } else {
        console.error(response.mensaje);
      }
    });
  }

  onProfesionalChange() {
    this.obtenerAgenda(this.profesional);
  }

  onFechaChange() {
    const id_medico = this.profesional;
    const fechaSeleccionada = new Date(this.fecha).toISOString().split('T')[0]; // Format the selected date to YYYY-MM-DD
    this.turnoService.obtenerAgenda(id_medico).subscribe(response => {
      console.log('Backend Response:', response); // Add this line to check the backend response
      if (response.codigo === 200) {
        this.horariosDisponibles = response.payload
          .filter((agenda: any) => new Date(agenda.fecha).toISOString().split('T')[0] === fechaSeleccionada && !agenda.ocupado)
          .map((agenda: any) => agenda.hora_entrada);
        console.log('Horarios Disponibles:', this.horariosDisponibles); // Check the mapped horarios
  
        // Filtrar horarios ocupados
        this.verificarTurnoExistente(id_medico, fechaSeleccionada).then(turnosExistentes => {
          this.horariosDisponibles = this.horariosDisponibles.filter(hora => {
            return !turnosExistentes.some(turno => turno.hora === hora);
          });
        });
      } else {
        console.error(response.mensaje);
      }
    });
  }

  async onSubmit(form: any) {
    if (form.valid) {
      const turnosExistentes = await this.verificarTurnoExistente(this.profesional, this.fecha);
      const turnoExistente = turnosExistentes.find((turno: any) => {
        return turno.fecha === this.fecha && turno.hora === this.hora;
      });

      if (turnoExistente) {
        alert('Ya existe un turno asignado en esta fecha y hora.');
        return;
      }

      this.obtenerAgenda(this.profesional); // Asegúrate de obtener la agenda antes de enviar el formulario
  
      // Espera un momento para que obtenerAgenda complete su ejecución
      setTimeout(() => {
        if (this.id_agenda === 0) {
          alert('No se ha podido obtener una agenda disponible. Por favor, selecciona un profesional válido.');
          return;
        }
  
        const turno: Turno = {
          nota: this.notas,
          id_agenda: this.id_agenda, // Replace with actual logic to get id_agenda
          fecha: this.fecha,
          hora: this.hora,
          id_paciente: this.id_paciente, // Use the id_paciente from local storage
          id_cobertura: this.cobertura
        };
  
        this.turnoService.agregarTurno(turno).subscribe(
          (response: { codigo: number; mensaje: string; }) => {
            if (response.codigo === 200) {
              this.profesionalNombre = this.profesionales.find(p => p.id_medico === this.profesional)?.nombre || '';
              this.openDialog();
            } else {
              alert('Error al asignar el turno: ' + response.mensaje);
            }
          },
          (error: any) => {
            console.error('Error en la petición', error);
            alert('Ocurrió un error al asignar el turno');
          }
        );
      }, 1000); // Ajusta el tiempo de espera según sea necesario
    }
  }

  obtenerAgenda(idMedico: number) {
    this.agendaService.obtenerAgenda(idMedico.toString()).subscribe((response: any) => {
      if (response.codigo === 200 && response.payload.length > 0) {
        const fechaSeleccionada = new Date(this.fecha).toISOString().split('T')[0];
        const agendaEncontrada = response.payload.find((agenda: any) => {
          const fechaAgenda = new Date(agenda.fecha).toISOString().split('T')[0];
          return fechaAgenda === fechaSeleccionada && agenda.hora_entrada === this.hora && !agenda.ocupado;
        });
  
        if (agendaEncontrada) {
          this.id_agenda = agendaEncontrada.id;
        } else {
          console.error('No se encontró una agenda disponible que coincida con la fecha y hora seleccionadas');
          this.id_agenda = 0; // Reset id_agenda if no match is found
        }
      } else {
        console.error('No se encontró agenda para el médico');
        this.id_agenda = 0; // Reset id_agenda if no agenda is found
      }
    }, error => {
      console.error('Error al obtener la agenda', error);
      this.id_agenda = 0; // Reset id_agenda on error
    });
  }

  verificarTurnoExistente(id_medico: number, fecha: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token') || '';
      this.turnoService.obtenerTurnoMedico({ id_medico, fecha }, token).subscribe(response => {
        if (response.codigo === 200) {
          resolve(response.payload);
        } else {
          console.error(response.mensaje);
          resolve([]);
        }
      }, error => {
        console.error('Error al verificar turno existente', error);
        resolve([]);
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TurnoConfirmadoDialogComponent, {
      data: {
        profesionalNombre: this.profesionalNombre,
        fecha: this.fecha,
        hora: this.hora
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/pacientes']);
    });
  }

  cancelar() {
    this.router.navigate(['/pacientes']);
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/pacientes']);
  }

  confirm() {
    this.closeModal();
    this.router.navigate(['/pacientes']);
  }
}