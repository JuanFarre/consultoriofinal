import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  paciente: any = {};
  datosForm: FormGroup;
  isEditing = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar // Inyecta MatSnackBar
  ) {
    this.datosForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]], // Entre 10 y 12 dígitos
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosPaciente();
  }

  cargarDatosPaciente() {
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    const idPaciente = datosUsuario.id || 0;

    this.usuarioService.obtenerUsuario(idPaciente).subscribe(response => {
      if (response.codigo === 200) {
        this.paciente = response.payload[0];
        this.datosForm.patchValue({
          email: this.paciente.email,
          telefono: this.paciente.telefono
        });
      } else {
        console.error(response.mensaje);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  editarDatos() {
    this.isEditing = true;
  }

  guardarCambios() {
    if (this.datosForm.valid) {
      if (this.datosForm.value.password !== this.datosForm.value.confirmPassword) {
        this.datosForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return;
      }

      const updatedData = {
        email: this.datosForm.value.email,
        telefono: this.datosForm.value.telefono,
        password: this.datosForm.value.password
      };

      this.usuarioService.actualizarUsuario(this.paciente.id, updatedData).subscribe(response => {
        if (response.codigo === 200) {
          this.snackBar.open('Cambios guardados con éxito', 'Aceptar', {
            duration: 3000
          });
          this.isEditing = false;
          this.cargarDatosPaciente();
        } else {
          console.error(response.mensaje);
        }
      });
    } else {
      alert('Hay errores en el formulario');
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.cargarDatosPaciente();
  }
}