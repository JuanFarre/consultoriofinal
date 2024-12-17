import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  datosForm: FormGroup;
  showPassword: boolean = false;
  isEditing: boolean = false;
  paciente: any = {};
  coberturas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService,
    private usuarioService: UsuarioService
  ) {
    this.datosForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10,12}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      cobertura: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.cargarDatosPaciente();
    this.cargarCoberturas();
  }

  cargarDatosPaciente(): void {
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario') || '{}');
    const idCobertura = localStorage.getItem('id_cobertura');
    const nombreCobertura = datosUsuario.nombre_cobertura || 'Sin cobertura';
    this.paciente = { ...datosUsuario, id_cobertura: idCobertura, nombre_cobertura: nombreCobertura };
    this.datosForm.patchValue({
      email: this.paciente.email,
      telefono: this.paciente.telefono,
      cobertura: idCobertura
    });
  }

  cargarCoberturas(): void {
    this.especialidadService.obtenerCoberturas().subscribe(response => {
      if (response.codigo === 200) {
        this.coberturas = response.payload;
      } else {
        console.error('Error al cargar coberturas:', response.mensaje);
      }
    });
  }

  editarDatos(): void {
    this.isEditing = true;
  }

  guardarCambios(): void {
    if (this.datosForm.valid) {
      if (this.datosForm.hasError('passwordMismatch')) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const datosActualizados = {
        email: this.datosForm.value.email,
        telefono: this.datosForm.value.telefono,
        password: this.datosForm.value.password,
        id_cobertura: this.datosForm.value.cobertura
      };

      // Llama al servicio para guardar los datos actualizados en la base de datos
      this.usuarioService.actualizarUsuario(this.paciente.id, datosActualizados).subscribe(
        response => {
          console.log('Datos actualizados en la base de datos:', response);

          // Actualiza localStorage con los nuevos datos
          const datosUsuarioActualizados = {
            ...this.paciente,
            email: datosActualizados.email,
            telefono: datosActualizados.telefono,
            id_cobertura: datosActualizados.id_cobertura,
            nombre_cobertura: this.coberturas.find(c => c.id === datosActualizados.id_cobertura)?.nombre || 'Sin cobertura'
          };
          localStorage.setItem('datosUsuario', JSON.stringify(datosUsuarioActualizados));
          localStorage.setItem('id_cobertura', datosActualizados.id_cobertura);

          this.isEditing = false;
          this.cargarDatosPaciente();
        },
        error => {
          console.error('Error al actualizar los datos en la base de datos:', error);
          alert('Ocurrió un error al actualizar los datos');
        }
      );
    } else {
      alert('Hay errores en el formulario');
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.cargarDatosPaciente();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }
}