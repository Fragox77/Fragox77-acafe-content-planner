import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { Publicacion, DIAS, TIPOS, ESTADOS } from '../types';

interface CalendarViewProps {
  publicaciones: Publicacion[];
  onAdd: () => void;
  onUpdate: (pub: Publicacion) => void;
  onDelete: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ publicaciones, onAdd, onUpdate, onDelete }) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Publicacion | null>(null);

  // FIX: The sort arguments 'a' and 'b' can be inferred as 'unknown'. Coercing them to numbers for the arithmetic operation.
  const semanas = useMemo(() => [...new Set(publicaciones.map(p => p.semana))].sort((a,b) => Number(a)-Number(b)), [publicaciones]);

  const filteredPubs = useMemo(() => selectedWeek 
    ? publicaciones.filter(p => p.semana === selectedWeek)
    : publicaciones, [publicaciones, selectedWeek]);

  const startEdit = (pub: Publicacion) => {
    setEditingId(pub.id);
    setEditForm({ ...pub });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdate(editForm);
    }
    cancelEdit();
  };

  const handleEditChange = <K extends keyof Publicacion,>(field: K, value: Publicacion[K]) => {
     if(editForm) {
        setEditForm({...editForm, [field]: value});
     }
  }
  
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editForm) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm({ ...editForm, imageUrl: reader.result as string });
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedWeek || ''}
          onChange={(e) => setSelectedWeek(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="">Todas las semanas</option>
          {semanas.map((semana) => (
            <option key={semana} value={semana}>Semana {semana}</option>
          ))}
        </select>
        
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Nueva Publicación
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-amber-800 uppercase bg-amber-100">
            <tr>
              {['Imagen', 'Semana', 'Fecha', 'Día', 'Hora', 'Tema', 'Tipo', 'Descripción', 'Estado', 'Acciones'].map(h => 
                <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredPubs.map((pub, idx) => (
              <tr key={pub.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'} border-b hover:bg-amber-100 transition-colors`}>
                {editingId === pub.id && editForm ? (
                   <>
                    <td className="px-2 py-2">
                        <input type="file" accept="image/*" onChange={handleEditImageChange} className="text-xs w-24"/>
                        {editForm.imageUrl && <img src={editForm.imageUrl} className="h-10 w-10 object-cover rounded mt-1"/>}
                    </td>
                    <td className="px-2 py-2"><input type="number" value={editForm.semana} onChange={e => handleEditChange('semana', parseInt(e.target.value))} className="w-16 border rounded px-2 py-1 text-sm bg-white" /></td>
                    <td className="px-2 py-2"><input type="date" value={editForm.fecha} onChange={e => handleEditChange('fecha', e.target.value)} className="border rounded px-2 py-1 text-sm bg-white" /></td>
                    <td className="px-2 py-2"><select value={editForm.dia} onChange={e => handleEditChange('dia', e.target.value)} className="border rounded px-2 py-1 text-sm bg-white">{DIAS.map(d => <option key={d} value={d}>{d}</option>)}</select></td>
                    <td className="px-2 py-2"><input type="time" value={editForm.hora} onChange={e => handleEditChange('hora', e.target.value)} className="border rounded px-2 py-1 text-sm bg-white" /></td>
                    <td className="px-2 py-2"><input type="text" value={editForm.temaCentral} onChange={e => handleEditChange('temaCentral', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white" /></td>
                    <td className="px-2 py-2"><select value={editForm.tipoContenido} onChange={e => handleEditChange('tipoContenido', e.target.value)} className="border rounded px-2 py-1 text-sm bg-white">{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                    <td className="px-2 py-2"><input type="text" value={editForm.descripcion} onChange={e => handleEditChange('descripcion', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white" /></td>
                    <td className="px-2 py-2"><select value={editForm.estado} onChange={e => handleEditChange('estado', e.target.value as Publicacion['estado'])} className="border rounded px-2 py-1 text-sm bg-white">{ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                    <td className="px-4 py-3"><div className="flex gap-3"><button onClick={saveEdit} className="text-green-600 hover:text-green-800"><Save size={18} /></button><button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800"><X size={18} /></button></div></td>
                   </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                        {pub.imageUrl ? (
                            <img src={pub.imageUrl} alt="Visual del post" className="h-10 w-10 object-cover rounded-md shadow-sm" />
                        ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                <ImageIcon size={20} className="text-gray-400" />
                            </div>
                        )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{pub.semana}</td>
                    <td className="px-4 py-3">{pub.fecha}</td>
                    <td className="px-4 py-3">{pub.dia}</td>
                    <td className="px-4 py-3">{pub.hora}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{pub.temaCentral}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-semibold">{pub.tipoContenido}</span></td>
                    <td className="px-4 py-3 max-w-xs truncate">{pub.descripcion}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${pub.estado === 'Programado' ? 'bg-blue-100 text-blue-800' : pub.estado === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{pub.estado}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => startEdit(pub)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button><button onClick={() => onDelete(pub.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button></div></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;