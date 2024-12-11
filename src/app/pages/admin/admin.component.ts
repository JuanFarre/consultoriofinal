import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { EditarUsuarioDialogComponent } from './editar-usuario-dialog/editar-usuario-dialog.component';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  coberturas: any[] = [];
  usuarioForm: FormGroup;
  isEditing: boolean = false;
  currentUserId: number | null = null;
  displayedColumns: string[] = ['dni', 'apellido', 'nombre', 'fecha_nacimiento', 'rol', 'email', 'telefono', 'cobertura', 'acciones'];

  constructor(
    private usuarioService: UsuarioService,
    private especialidadService: EspecialidadService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.usuarioForm = this.fb.group({
      dni: [''],
      apellido: [''],
      nombre: [''],
      fecha_nacimiento: [''],
      rol: [''],
      email: [''],
      telefono: [''],
      password: [''],
      id_cobertura: [null]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCoberturas();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (response: any) => {
        if (response.codigo === 200) {
          this.usuarios = response.payload;
          this.filteredUsuarios = this.usuarios;
        } else {
          console.error(response.mensaje);
        }
      },
      error => console.error(error)
    );
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

  filtrarUsuarios(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(filterValue) ||
      usuario.apellido.toLowerCase().includes(filterValue) ||
      usuario.rol.toLowerCase().includes(filterValue)
    );
  }

  agregarUsuario(): void {
    const usuarioData = this.usuarioForm.value;
    if (usuarioData.id_cobertura === null) {
      usuarioData.id_cobertura = null;
    }

    this.usuarioService.crearUsuario(usuarioData).subscribe(
      response => {
        if (response.codigo === 200) {
          this.cargarUsuarios();
          this.limpiarFormulario();
        } else {
          console.error(response.mensaje);
        }
      },
      error => console.error(error)
    );
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditarUsuarioDialogComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (usuario.id !== null) { // Type guard to ensure usuario.id is not null
          const updatedUsuario = {
            ...usuario,
            ...result
          };
          this.usuarioService.actualizarUsuario(usuario.id, updatedUsuario).subscribe(
            response => {
              if (response.codigo === 200) {
                this.cargarUsuarios();
              } else {
                console.error(response.mensaje);
              }
            },
            error => console.error(error)
          );
        } else {
          console.error('Usuario ID is null');
        }
      }
    });
  }

  limpiarFormulario(): void {
    this.isEditing = false;
    this.currentUserId = null;
    this.usuarioForm.reset();
  }
}