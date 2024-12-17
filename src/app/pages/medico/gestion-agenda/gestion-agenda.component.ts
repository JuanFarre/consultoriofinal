import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Horario {
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

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
    console.log('ID Médico:', this.id_medico); // Verificar que el ID del médico se obtiene correctamente
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
          console.log('Horarios cargados:', this.horarios); // Verifica que los horarios se carguen correctamente
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
          console.log('Especialidades cargadas:', this.especialidades); // Verifica que las especialidades se carguen correctamente
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
  
      // Verificar si ya existe una agenda en el mismo día y horario
      this.agendaService.obtenerAgenda(this.id_medico).subscribe(
        response => {
          if (response.codigo === 200) {
            const horariosExistentes: Horario[] = response.payload.map((agenda: any) => ({
              fecha: agenda.fecha.split('T')[0],
              horaInicio: agenda.hora_entrada,
              horaFin: agenda.hora_salida
            }));
  
            const nuevaHoraInicio = this.convertirAHoras(horaInicio);
            const nuevaHoraFin = this.convertirAHoras(horaFin);
  
            const agendaExistente = horariosExistentes.find((horario: Horario) => 
              horario.fecha === this.selectedDate && 
              ((nuevaHoraInicio >= this.convertirAHoras(horario.horaInicio) && nuevaHoraInicio < this.convertirAHoras(horario.horaFin)) ||
              (nuevaHoraFin > this.convertirAHoras(horario.horaInicio) && nuevaHoraFin <= this.convertirAHoras(horario.horaFin)) ||
              (nuevaHoraInicio <= this.convertirAHoras(horario.horaInicio) && nuevaHoraFin >= this.convertirAHoras(horario.horaFin)))
            );
  
            if (agendaExistente) {
              console.log('Agenda existente encontrada:', agendaExistente); // Verificar si se encuentra una agenda existente
              this.MatSnackBar.open('Ya existe una agenda creada en ese día y horario', 'Cerrar', { duration: 3000 });
              return;
            }
  
            this.agendaService.crearAgenda(nuevaAgenda).subscribe(
              response => {
                if (response.codigo === 200) {
                  this.cargarHorarios(); // Actualiza la tabla de horarios disponibles
                  this.agendaForm.reset();
                  this.agendaForm.patchValue({ fecha: this.selectedDate, especialidad: this.especialidades[0].id_especialidad });
                  this.MatSnackBar.open('Horario agendado con éxito', 'Cerrar', { duration: 3000 });
                } else {
                  console.error('Error al crear la agenda:', response.mensaje);
                }
              },
              error => {
                console.error('Error en la petición', error);
              }
            );
          } else {
            console.error('Error al obtener la agenda:', response.mensaje);
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

  private convertirAHoras(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  private hayConflicto(nuevoHorario: { entrada: string, salida: string }): boolean {
    const entradaNuevo = this.convertirAHoras(nuevoHorario.entrada);
    const salidaNuevo = this.convertirAHoras(nuevoHorario.salida);

    console.log("Revisando conflictos para el horario:", nuevoHorario);

    const horariosDelDia = this.horarios.filter(h => h.fecha === this.selectedDate);

    return horariosDelDia.some(h => {
      const entradaExistente = this.convertirAHoras(h.rango.split(' - ')[0]);
      const salidaExistente = this.convertirAHoras(h.rango.split(' - ')[1]);

      return (
        (entradaNuevo >= entradaExistente && entradaNuevo < salidaExistente) || 
        (salidaNuevo > entradaExistente && salidaNuevo <= salidaExistente) || 
        (entradaNuevo <= entradaExistente && salidaNuevo >= salidaExistente)
      );
    });
  }
}