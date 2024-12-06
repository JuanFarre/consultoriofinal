import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta esta URL según sea necesario

  constructor(private http: HttpClient) { }

  agregarTurno(turno: Turno): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(`${this.apiUrl}/asignarTurnoPaciente`, turno, { headers });
  }

  obtenerAgenda(id_medico: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerAgenda/${id_medico}`, { headers });
  }

  obtenerTurnosPaciente(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerTurnoPaciente/${id}`, { headers });
  }

  obtenerTurnosMedico(id_medico: number, fecha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(`${this.apiUrl}/obtenerTurnosMedico`, { id_medico, fecha }, { headers });
  }

  obtenerTurnosReservados(id_medico: number, fecha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerTurnosReservados/${id_medico}/${fecha}`, { headers });
  }

  actualizarTurno(id: number, turno: Turno): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<any>(`${this.apiUrl}/actualizarTurnoPaciente/${id}`, turno, { headers });
  }

  eliminarTurno(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<any>(`${this.apiUrl}/eliminarTurnoPaciente/${id}`, { headers });
  }

  obtenerTurnos(): Turno[] {
    // Implementación existente
    return [];
  }

  obtenerMedicosPorFecha(fecha: string) {
    // Implementación existente
  }

  // ordenar del mas antiguo al mas nuevo
  private ordenarTurnos() {
    // Implementación existente
  }
}