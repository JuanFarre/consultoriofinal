import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta esta URL según sea necesario

  constructor(private http: HttpClient) { }

  obtenerAgenda(id_medico: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    return this.http.get<any>(`${this.apiUrl}/obtenerAgenda/${id_medico}`, { headers });
  }

  crearAgenda(agenda: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(`${this.apiUrl}/crearAgenda`, agenda, { headers });
  }

  modificarAgenda(id: string, agenda: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<any>(`${this.apiUrl}/modificarAgenda/${id}`, agenda, { headers });
  }
}