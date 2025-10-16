
import { Publicacion } from '../types';
import { TEMAS, TIPOS, DIAS } from '../types';

export const generateCalendar = (): Publicacion[] => {
  const publicaciones: Publicacion[] = [];
  const startDate = new Date(2025, 9, 14); // 14 Oct 2025
  const endDate = new Date(2025, 11, 31); // 31 Dec 2025
  
  const horarios = ["09:00", "12:00", "15:00", "18:00", "20:00"];
  
  let semana = 1;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const temaIndex = (semana - 1) % TEMAS.length;
    const temaSemana = TEMAS[temaIndex];
    
    for (let dia = 0; dia < 7; dia++) {
      const fechaPub = new Date(currentDate);
      fechaPub.setDate(fechaPub.getDate() + dia);
      
      if (fechaPub > endDate) break;
      
      const diaSemana = fechaPub.getDay();
      const numPubs = diaSemana >= 1 && diaSemana <= 5 ? 3 : 2; // 3 on weekdays, 2 on weekends
      
      for (let i = 0; i < numPubs; i++) {
        let tipoContenido: string = "Post";
        if (i === 0 && [1, 3, 5].includes(diaSemana)) { // Reels on Mon, Wed, Fri morning
          tipoContenido = "Reel";
        } else if (i === 2) {
          tipoContenido = "Story";
        }
        
        const contenidos: { [key: string]: string[] } = {
          "Historia y misión de ACAFE": ["Post fundación ACAFE", "Video testimonial fundadores", "Story hitos históricos"],
          "Testimonios y comunidad": ["Reel testimonial miembro", "Foto equipo trabajo", "Story frase inspiracional"],
          "Proceso del café": ["Carrusel proceso cultivo", "Reel cosecha café", "Story detrás cámaras"],
          "Cafés especiales y variedades": ["Reel variedades café", "Infografía beneficios", "Story encuesta preferencias"],
          "Recetas con café": ["Post receta café especial", "Reel paso a paso", "Story tips preparación"],
          "Cultura cafetera": ["Tip del día café", "Story dato curioso", "Carrusel origen café"],
          "Q&A en vivo": ["Instagram Live experto", "Story preguntas frecuentes", "Post anuncio Q&A"],
          "Promociones y concursos": ["Reel concurso", "Banner descuento especial", "Story dinámica sorteo"],
          "Fechas especiales": ["Post navideño", "Reel decorativo estacional", "Story hashtag temático"],
          "Colaboraciones y aliados": ["Post alianza estratégica", "Repost colaborador", "Story mención socio"],
          "Cierre del año": ["Carrusel logros 2025", "Reel retrospectivo año", "Story agradecimiento"],
          "Nuevos proyectos 2026": ["Video teaser proyectos", "Post propósitos 2026", "Story encuesta expectativas"]
        };
        
        publicaciones.push({
          id: `pub-${Date.now()}-${semana}-${dia}-${i}`,
          semana,
          fecha: fechaPub.toISOString().split('T')[0],
          dia: DIAS[fechaPub.getDay()],
          hora: horarios[i % horarios.length],
          temaCentral: temaSemana,
          tipoContenido: tipoContenido,
          descripcion: contenidos[temaSemana][i % 3],
          redSocial: "Instagram",
          estado: "Programado"
        });
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 7);
    semana++;
  }
  
  return publicaciones;
};
