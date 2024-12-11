export interface Usuario {
  id: number | null;
  dni: string; // Documento Nacional de Identidad
  apellido: string;
  nombre: string;
  fecha_nacimiento: Date; // Fecha de nacimiento
  password: string; // Contraseña del usuario
  rol: 'operador' | 'medico' | 'administrador' | 'paciente'; // Rol del usuario
  email: string;
  telefono: string;
  id_cobertura: number | null;
  nombre_cobertura: string | null;
}