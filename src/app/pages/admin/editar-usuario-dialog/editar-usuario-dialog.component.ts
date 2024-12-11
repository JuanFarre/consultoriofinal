import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-editar-usuario-dialog',
  templateUrl: './editar-usuario-dialog.component.html',
  styleUrls: ['./editar-usuario-dialog.component.css']
})
export class EditarUsuarioDialogComponent implements OnInit {
  usuarioForm: FormGroup;
  coberturas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private fb: FormBuilder,
    private especialidadService: EspecialidadService
  ) {
    this.usuarioForm = this.fb.group({
      dni: [data.dni],
      apellido: [data.apellido],
      nombre: [data.nombre],
      fecha_nacimiento: [data.fecha_nacimiento],
      rol: [data.rol],
      email: [data.email],
      telefono: [data.telefono],
      password: [''],
      id_cobertura: [data.id_cobertura]
    });
  }

  ngOnInit(): void {
    this.cargarCoberturas();
  }

  cargarCoberturas(): void {
    this.especialidadService.obtenerCoberturas().subscribe(
      (response: any) => {
        if (response.codigo === 200) {
          this.coberturas = response.payload;
        } else {
          console.error(response.mensaje);
        }
      },
      error => console.error(error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.usuarioForm.value);
  }
}