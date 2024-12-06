import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/services/turno.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
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
  id_agenda: number = 1; // Placeholder value, replace with actual logic to get id_agenda
  id_paciente: number = 0; // Initialize to 0

  constructor(
    private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
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

  onFechaChange() {
    const id_medico = this.profesional;
    const fechaSeleccionada = new Date(this.fecha).toISOString().split('T')[0]; // Format the selected date to YYYY-MM-DD
  
    // Obtener la agenda del médico
    this.turnoService.obtenerAgenda(id_medico).subscribe(response => {
      console.log('Backend Response:', response); // Add this line to check the backend response
      if (response.codigo === 200) {
        const agenda = response.payload.filter((agenda: any) => new Date(agenda.fecha).toISOString().split('T')[0] === fechaSeleccionada);
        const horariosDisponibles = agenda.map((agenda: any) => agenda.hora_entrada);
  
        // Obtener los turnos reservados para la fecha seleccionada usando obtenerTurnosMedico
        this.turnoService.obtenerTurnosMedico(id_medico, fechaSeleccionada).subscribe(turnosResponse => {
          if (turnosResponse.codigo === 200) {
            const turnosReservados = turnosResponse.payload.map((turno: any) => turno.hora);
  
            // Filtrar los horarios disponibles para excluir los horarios ya reservados
            this.horariosDisponibles = horariosDisponibles.filter((hora: string) => !turnosReservados.includes(hora));
            console.log('Horarios Disponibles:', this.horariosDisponibles); // Check the filtered horarios
  
            // Mostrar mensaje si no hay horarios disponibles
            if (this.horariosDisponibles.length === 0) {
              alert('El médico no tiene horarios disponibles o no trabaja ese día');
            }
          } else {
            console.error(turnosResponse.mensaje);
          }
        });
      } else {
        console.error(response.mensaje);
      }
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      const turno: Turno = {
        nota: this.notas,
        id_agenda: this.id_agenda, // Replace with actual logic to get id_agenda
        fecha: this.fecha,
        hora: this.hora,
        id_paciente: this.id_paciente, // Use the id_paciente from local storage
        id_cobertura: this.cobertura
      };

      this.turnoService.agregarTurno(turno).subscribe(
        response => {
          if (response.codigo === 200) {
            this.profesionalNombre = this.profesionales.find(p => p.id_medico === this.profesional)?.nombre || '';
            this.openDialog();
          } else {
            alert('Error al asignar el turno: ' + response.mensaje);
          }
        },
        error => {
          console.error('Error en la petición', error);
          alert('Ocurrió un error al asignar el turno');
        }
      );
    }
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