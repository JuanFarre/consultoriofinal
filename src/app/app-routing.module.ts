import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { NuevoTurnoComponent } from './pages/paciente/nuevo-turno/nuevo-turno.component';
import { MisTurnosComponent } from './pages/paciente/mis-turnos/mis-turnos.component';
import { MisDatosComponent } from './pages/paciente/mis-datos/mis-datos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { TurnosProgramadosComponent } from './pages/medico/turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './pages/medico/gestion-agenda/gestion-agenda.component';
import { OperadorComponent } from './pages/operador/operador.component';
import { TurnosProgramadosOperadorComponent } from './pages/operador/turnos-programados-operador/turnos-programados-operador.component';
import { RegistrarPacientesComponent } from './pages/operador/registrar-pacientes/registrar-pacientes.component';
import { authGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'pacientes', component: PacienteComponent, canActivate: [authGuard] },
  { path: 'pacientes/nuevo-turno', component: NuevoTurnoComponent, canActivate: [authGuard] },
  { path: 'pacientes/mis-turnos', component: MisTurnosComponent, canActivate: [authGuard] },
  { path: 'pacientes/mis-datos', component: MisDatosComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent,canActivate: [authGuard] },
  { path: 'medico', component: MedicoComponent, canActivate: [authGuard] },
  { path: 'medico/turnos-programados', component: TurnosProgramadosComponent , canActivate: [authGuard]},
  { path: 'medico/gestion-agenda', component: GestionAgendaComponent, canActivate: [authGuard] },
  { path: 'operador', component: OperadorComponent , canActivate: [authGuard]},
  { path: 'operador/turnos-programados-operador', component: TurnosProgramadosOperadorComponent, canActivate: [authGuard] },
  { path: 'operador/registrar-pacientes', component: RegistrarPacientesComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }