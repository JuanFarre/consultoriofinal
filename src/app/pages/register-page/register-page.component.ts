import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  @Input() rol: string = 'paciente'; // Propiedad de entrada para el rol del usuario
  @Input() mostrarBotonVolver: boolean = false; // Propiedad de entrada para mostrar el botón "Volver"
  registroForm!: FormGroup;
  confirmPassword: string = "";
  isSubmitting: boolean = false;
  coberturas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private especialidadService: EspecialidadService,
    @Optional() private dialogRef: MatDialogRef<RegisterPageComponent>, // Hacer MatDialogRef opcional
    private router: Router // Inyectar el servicio Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required, this.noFechaFuturaValidator()]], // Aplica la validación personalizada
      telefono: [''],
      id_cobertura: ['', [Validators.required]]
    });

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
    if (this.registroForm.value.password !== this.registroForm.value.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    if (this.registroForm.valid) {
      this.isSubmitting = true;

      const usuario: Usuario = {
        ...this.registroForm.value,
        rol: this.rol // Usar el rol proporcionado como entrada
      };

      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);
          if (this.dialogRef) {
            this.dialogRef.close();
          }
        },
        error: (err) => {
          console.error('Error al registrar el usuario:', err);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  volver(): void {
    this.router.navigate(['/operador']);
  }

  // Función de validación personalizada para verificar que la fecha de nacimiento no sea futura
  noFechaFuturaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      return fechaNacimiento <= hoy ? null : { fechaFutura: true };
    };
  }
}