export interface Publicacion {
  id: string;
  semana: number;
  fecha: string;
  dia: string;
  hora: string;
  temaCentral: string;
  tipoContenido: string;
  descripcion: string;
  redSocial: string;
  estado: 'Programado' | 'Publicado' | 'Borrador';
  imageUrl?: string;
}

export interface TrackingEntry {
  id: string;
  fecha: string;
  tipo: string;
  likes: number;
  comentarios: number;
  compartidos: number;
  alcance: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'editor' | 'viewer';
  activo: boolean;
  fechaCreacion: string;
}

export interface Configuracion {
  tema: string;
  colores: {
    primario: string;
    secundario: string;
    fondo: string;
    texto: string;
  };
  funcionalidades: string[];
}

export type ActiveTab = 'calendar' | 'metrics' | 'distribution' | 'tracking' | 'admin';

export const TEMAS = [
  "Historia y misión de ACAFE",
  "Testimonios y comunidad",
  "Proceso del café",
  "Cafés especiales y variedades",
  "Recetas con café",
  "Cultura cafetera",
  "Q&A en vivo",
  "Promociones y concursos",
  "Fechas especiales",
  "Colaboraciones y aliados",
  "Cierre del año",
  "Nuevos proyectos 2026"
];

export const TIPOS = ["Post", "Reel", "Story", "Carrusel", "IGTV"];
export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const ESTADOS: Publicacion['estado'][] = ['Programado', 'Publicado', 'Borrador'];
export const ROLES: Usuario['rol'][] = ['admin', 'editor', 'viewer'];