import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderWelcomeComponent } from './shared/header-welcome/header-welcome.component';
import { HeaderMainComponent } from './shared/header-main/header-main.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { OperadorComponent } from './pages/operador/operador.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { NuevoTurnoComponent } from './pages/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './pages/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './pages/paciente/mis-datos/mis-datos.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TurnosProgramadosComponent } from './pages/medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './pages/medico/gestion-agenda/gestion-agenda.component';
import { MatTableModule } from '@angular/material/table';
import { TurnosProgramadosOperadorComponent } from './pages/operador/turnos-programados-operador/turnos-programados-operador.component';
import { RegistrarPacientesComponent } from './pages/operador/registrar-pacientes/registrar-pacientes.component';
import { EditarAgendaModalComponent } from './pages/operador/editar-agenda-modal/editar-agenda-modal.component';
import { TurnosDialogComponent } from './pages/operador/turnos-dialog/turnos-dialog.component';
import { TurnoNotasDialogComponent } from './pages/medico/turnos-programados/turno-notas-dialog/turno-notas-dialog.component';
import { TurnoConfirmadoDialogComponent } from './pages/paciente/nuevo-turno/turno-confirmado-dialog/turno-confirmado-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { NotaComponent } from './pages/operador/turnos-programados-operador/nota/nota.component';
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    RegisterPageComponent,
    FooterComponent,
    HeaderWelcomeComponent,
    HeaderMainComponent,
    LoginPageComponent,
    MainPageComponent,
    AdminComponent,
    OperadorComponent,
    MedicoComponent,
    PacienteComponent,
    NuevoTurnoComponent,
    MisTurnosComponent,
    MisDatosComponent,
    TurnosProgramadosComponent,
    GestionAgendaComponent,
    TurnosProgramadosOperadorComponent,
    RegistrarPacientesComponent,
    EditarAgendaModalComponent,
    TurnosDialogComponent,
    TurnoNotasDialogComponent,
    TurnoConfirmadoDialogComponent,
    NotaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule // Asegúrate de importar MatButtonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }