import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta esta URL según sea necesario
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  login(usuario: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, password }).pipe(
      tap(response => {
        if (response.codigo === 200 && response.payload && response.payload.length > 0) {
          const user = response.payload[0];
          if (response.jwt) {
            localStorage.setItem('token', response.jwt);
          } else {
            throw new Error('Token is undefined');
          }
          localStorage.setItem('datosUsuario', JSON.stringify(user)); // Guarda los datos del usuario
          this.loggedInSubject.next(true);
        } else {
          throw new Error('Respuesta del servidor no válida');
        }
      }),
      switchMap(response => {
        const idUsuario = response.payload[0].id;
        return this.obtenerCoberturaUsuario(idUsuario);
      })
    );
  }

  obtenerCoberturaUsuario(idUsuario: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/obtenerUsuario/${idUsuario}`, { headers }).pipe(
      tap(response => {
        if (response.codigo === 200 && response.payload.length > 0) {
          const usuario = response.payload[0];
          if (usuario.id_cobertura !== undefined) {
            localStorage.setItem('id_cobertura', usuario.id_cobertura.toString()); // Guarda la cobertura médica del usuario
          } else {
            console.error('id_cobertura no está definido en la respuesta del servidor');
          }
        } else {
          console.error('Error al obtener la cobertura médica del usuario');
        }
      })
    );
  }

  logout(): void {
    localStorage.clear(); // Limpia completamente el localStorage
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}