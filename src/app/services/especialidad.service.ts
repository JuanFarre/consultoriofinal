import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:4000/api'; // Adjust this URL as needed

  constructor(private http: HttpClient) { }

  obtenerEspecialidades(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerEspecialidades`, { headers });
  }

  obtenerCoberturas(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerCoberturas`, { headers });
  }

  obtenerMedicoPorEspecialidad(id_especialidad: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${id_especialidad}`, { headers });
  }

  obtenerEspecialidadesMedico(id_medico: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerEspecialidadesMedico/${id_medico}`, { headers });
  }
  crearMedicoEspecialidad(data: { id_medico: number, id_especialidad: number }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(`${this.apiUrl}/crearMedicoEspecialidad`, data, { headers });
  }
}