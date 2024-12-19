import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-turnos-dialog',
  templateUrl: './turnos-dialog.component.html',
  styleUrls: ['./turnos-dialog.component.css']
})
export class TurnosDialogComponent {
  turnos: any[];
  medico: any;
  fecha: string;

  constructor(
    public dialogRef: MatDialogRef<TurnosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private turnoService: TurnoService
  ) {
    this.turnos = data.turnos;
    this.medico = data.medico;
    this.fecha = data.fecha;
    console.log('Datos recibidos en el diálogo:', this.turnos, this.medico, this.fecha); // Verifica los datos recibidos
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  eliminarTurno(id_turno: number): void {
    console.log('Eliminando turno con id:', id_turno); // Verifica el id del turno
    this.turnoService.eliminarTurno(id_turno).subscribe(response => {
      console.log('Turno eliminado:', response);
      this.turnos = this.turnos.filter(turno => turno.id_turno !== id_turno);
    });
  }
}