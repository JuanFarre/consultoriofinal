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

  obtenerTurnos(): Turno[] {
    // Implementación existente
    return [];
  }

  obtenerMedicosPorFecha(fecha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerMedicosPorFecha/${fecha}`, { headers });
  }

  obtenerTurnoMedico(body: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/obtenerTurnosMedico`, body, { headers });
  }

  // ordenar del mas antiguo al mas nuevo
  private ordenarTurnos() {
    // Implementación existente
  }

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
  
}