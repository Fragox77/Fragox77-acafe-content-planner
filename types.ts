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

export type ActiveTab = 'calendar' | 'metrics' | 'distribution' | 'tracking';

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