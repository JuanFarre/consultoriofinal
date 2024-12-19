import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  especialidades: any[] = [];
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
      dni: ['', Validators.required],
      apellido: ['', Validators.required],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', Validators.required],
      id_cobertura: [null],
      id_especialidad: [null]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCoberturas();
    this.cargarEspecialidades();
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

  cargarEspecialidades(): void {
    this.especialidadService.obtenerEspecialidades().subscribe(
      (response: any) => {
        if (response.codigo === 200) {
          this.especialidades = response.payload;
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
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      const fechaNacimiento = new Date(usuarioData.fecha_nacimiento);
      const fechaActual = new Date();

      if (fechaNacimiento > fechaActual) {
        console.error('La fecha de nacimiento no puede ser una fecha futura');
        return;
      }

      if (usuarioData.id_cobertura === null) {
        usuarioData.id_cobertura = null;
      }

      this.usuarioService.crearUsuario(usuarioData).subscribe(
        response => {
          console.log('Crear usuario response:', response); // Log the response
          if (response.codigo === 200) {
            this.cargarUsuarios();
            this.limpiarFormulario();

            // If the user is a "Medico", assign the specialty
            if (usuarioData.rol === 'medico' && usuarioData.id_especialidad) {
              const id_medico = response.payload[0].id_usuario; // Extract id_usuario from the payload array
              console.log('ID Medico:', id_medico); // Log the ID Medico
              const id_especialidad = usuarioData.id_especialidad;
              this.especialidadService.crearMedicoEspecialidad({ id_medico, id_especialidad }).subscribe(
                res => {
                  if (res.codigo !== 200) {
                    console.error(res.mensaje);
                  }
                },
                error => console.error(error)
              );
            }
          } else {
            console.error(response.mensaje);
          }
        },
        error => console.error(error)
      );
    } else {
      console.error('El formulario no está completo');
    }
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