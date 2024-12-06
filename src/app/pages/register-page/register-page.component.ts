import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'; // Para cerrar el pop-up
import { UsuarioService } from 'src/app/services/usuario.service';
import { EspecialidadService } from 'src/app/services/especialidad.service'; // Importa el servicio de especialidades
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registroForm!: FormGroup;
  confirmPassword: string = ""; // Almacenamos el valor de confirmación de contraseña
  isSubmitting: boolean = false;  // Controla si estamos enviando los datos
  coberturas: any[] = []; // Almacena las coberturas médicas

  constructor(
    private formBuilder: FormBuilder,  // Usamos FormBuilder para crear el formulario
    private usuarioService: UsuarioService,  // El servicio que maneja las peticiones de usuario
    private especialidadService: EspecialidadService,  // El servicio que maneja las coberturas médicas
    private dialogRef: MatDialogRef<RegisterPageComponent>  // Para cerrar el pop-up
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con las validaciones necesarias
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      telefono: [''],
      id_cobertura: ['', [Validators.required]] // Agrega el campo para la cobertura médica
    });

    // Cargar las coberturas médicas
    this.cargarCoberturas();
  }

  cargarCoberturas(): void {
    this.especialidadService.obtenerCoberturas().subscribe(response => {
      if (response.codigo === 200) {
        this.coberturas = response.payload;
      } else {
        console.error(response.mensaje);
      }
    });
  }

  registrarUsuario(): void {
    // Verificamos que las contraseñas coincidan
    if (this.registroForm.value.password !== this.registroForm.value.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    // Si el formulario es válido, procedemos con la creación del usuario
    if (this.registroForm.valid) {
      this.isSubmitting = true;  // Marcamos que estamos enviando la solicitud

      // Creamos el objeto usuario con los datos del formulario
      const usuario: Usuario = {
        ...this.registroForm.value,
        rol: 'paciente',  // Rol predeterminado
      };

      // Llamamos al servicio para crear el usuario
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);

          // Cerramos el pop-up si la solicitud es exitosa
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error al registrar el usuario:', err);

          // Revertimos el estado de "enviando" si ocurre un error
          this.isSubmitting = false;
        },
        complete: () => {
          // Al finalizar la solicitud (ya sea exitosa o con error), restauramos el estado
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }
}