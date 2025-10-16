import { Publicacion } from '../types';

export const exportToCSV = (publicaciones: Publicacion[]) => {
  const headers = ['Semana', 'Fecha', 'Día', 'Hora', 'Tema Central', 'Tipo', 'Descripción', 'Estado', 'Red Social', 'Imagen'];
  const rows = publicaciones.map(p => [
    p.semana,
    p.fecha,
    p.dia,
    p.hora,
    `"${p.temaCentral.replace(/"/g, '""')}"`,
    p.tipoContenido,
    `"${p.descripcion.replace(/"/g, '""')}"`,
    p.estado,
    p.redSocial,
    p.imageUrl ? 'Sí' : 'No'
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Parrilla_ACAFE_Oct_Dic_2025.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};