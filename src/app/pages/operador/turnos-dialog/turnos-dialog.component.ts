import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.turnos = data.turnos;
    this.medico = data.medico;
    this.fecha = data.fecha;
    console.log('Datos recibidos en el diálogo:', this.turnos, this.medico, this.fecha); // Verifica los datos recibidos
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}