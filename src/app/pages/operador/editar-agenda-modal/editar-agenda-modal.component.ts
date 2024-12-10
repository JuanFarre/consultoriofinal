import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendaService } from 'src/app/services/agenda.service';

@Component({
  selector: 'app-editar-agenda-modal',
  templateUrl: './editar-agenda-modal.component.html',
  styleUrls: ['./editar-agenda-modal.component.css']
})
export class EditarAgendaModalComponent implements OnInit {
  horarios: any[] = [];
  agendaId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditarAgendaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { medico: any, fecha: string },
    private agendaService: AgendaService
  ) {}

  ngOnInit(): void {
    this.obtenerAgenda();
  }

  obtenerAgenda(): void {
    this.agendaService.obtenerAgenda(this.data.medico.id_medico.toString()).subscribe(response => {
      if (response.codigo === 200) {
        this.horarios = response.payload.filter((item: any) => {
          const itemFecha = new Date(item.fecha).toISOString().split('T')[0];
          return itemFecha === this.data.fecha && item.id_especialidad === this.data.medico.id_especialidad;
        });
      } else {
        console.error(response.mensaje);
      }
    });
  }

  // Cerrar el modal sin guardar cambios
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Guardar los cambios y cerrar el modal
  guardar(): void {
    const requests = this.horarios.map(horario => {
      const agendaData = {
        id_medico: this.data.medico.id_medico,
        id_especialidad: this.data.medico.id_especialidad,
        fecha: this.data.fecha,
        hora_entrada: horario.hora_entrada,
        hora_salida: horario.hora_salida
      };
      return this.agendaService.modificarAgenda(horario.id.toString(), agendaData).toPromise();
    });

    Promise.all(requests).then(responses => {
      const allSuccessful = responses.every(response => response.codigo === 200);
      if (allSuccessful) {
        this.dialogRef.close(this.horarios);
      } else {
        console.error('Error al guardar algunos horarios');
      }
    }).catch(error => {
      console.error('Error al guardar horarios', error);
    });
  }
}