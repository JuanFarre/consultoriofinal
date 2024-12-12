import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  horarios: { fecha: string; rango: string }[] = [];
  especialidades: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0]; // Almacena la fecha como string en formato YYYY-MM-DD
  id_medico: string = '';

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private especialidadService: EspecialidadService,
    private router: Router,
    private MatSnackBar: MatSnackBar
  ) {
    this.agendaForm = this.fb.group({
      fecha: [this.selectedDate],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      especialidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    this.id_medico = userData.id || '';
    this.cargarHorarios();
    this.cargarEspecialidades();
  }

  cargarHorarios(): void {
    this.agendaService.obtenerAgenda(this.id_medico).subscribe(
      response => {
        if (response.codigo === 200) {
          this.horarios = response.payload.map((agenda: any) => ({
            fecha: agenda.fecha.split('T')[0], // Formatear la fecha para que coincida con el formato YYYY-MM-DD
            rango: `${agenda.hora_entrada} - ${agenda.hora_salida}`
          }));
          console.log(this.horarios); // Verifica que los horarios se carguen correctamente
        } else {
          console.error('Error al obtener la agenda:', response.mensaje);
        }
      },
      error => {
        console.error('Error en la petición', error);
      }
    );
  }

  cargarEspecialidades(): void {
    this.especialidadService.obtenerEspecialidadesMedico(this.id_medico).subscribe(
      response => {
        if (response.codigo === 200) {
          this.especialidades = response.payload;
          console.log(this.especialidades); // Verifica que las especialidades se carguen correctamente
          if (this.especialidades.length > 0) {
            this.agendaForm.patchValue({ especialidad: this.especialidades[0].id_especialidad });
          }
        } else {
          console.error('Error al obtener las especialidades:', response.mensaje);
        }
      },
      error => {
        console.error('Error en la petición', error);
      }
    );
  }

  agregarHorario(): void {
    if (this.agendaForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
  
    const { horaInicio, horaFin, especialidad } = this.agendaForm.value;
  
    if (horaInicio && horaFin && especialidad) {
      const nuevaAgenda = {
        id_medico: this.id_medico,
        id_especialidad: especialidad,
        fecha: this.selectedDate,
        hora_entrada: horaInicio,
        hora_salida: horaFin
      };
  
      this.agendaService.crearAgenda(nuevaAgenda).subscribe(
        response => {
          if (response.codigo === 200) {
            this.horarios.push({ fecha: this.selectedDate, rango: `${horaInicio} - ${horaFin}` });
            this.agendaForm.reset();
            this.agendaForm.patchValue({ fecha: this.selectedDate, especialidad: this.especialidades[0].id_especialidad });
            this.MatSnackBar.open('Horario agendado con éxito', 'Cerrar', { duration: 3000 });
            this.cargarHorarios(); // Actualiza la tabla de horarios disponibles
          } else {
            console.error('Error al crear la agenda:', response.mensaje);
          }
        },
        error => {
          console.error('Error en la petición', error);
        }
      );
    }
  }

  obtenerHorariosPorFecha(fecha: string): { fecha: string; rango: string }[] {
    const formattedDate = new Date(fecha).toISOString().split('T')[0];
    const filteredHorarios = this.horarios.filter(horario => horario.fecha === formattedDate);
    console.log(`Horarios para la fecha ${formattedDate}:`, filteredHorarios);
    return filteredHorarios;
  }

  volver(): void {
    this.router.navigate(['/medico']);
  }
}