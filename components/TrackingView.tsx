
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TrackingEntry } from '../types';

interface TrackingViewProps {
  data: TrackingEntry[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof TrackingEntry, value: string | number) => void;
  onDelete: (id: string) => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const calculateEngagement = (row: TrackingEntry) => {
    if (!row.alcance || row.alcance === 0) return '0.00%';
    const engagement = ((row.likes + row.comentarios + row.compartidos) / row.alcance) * 100;
    return `${engagement.toFixed(2)}%`;
  };

  const handleUpdate = (id: string, field: keyof TrackingEntry, value: string) => {
      const isNumericField = field !== 'fecha' && field !== 'tipo';
      onUpdate(id, field, isNumericField ? parseInt(value) || 0 : value);
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#492b2b]">Seguimiento de Métricas</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-[#841f82] text-white px-4 py-2 rounded-lg hover:bg-[#6a1969] transition-colors shadow-md"
        >
          <Plus size={20} />
          Agregar Fila
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-[#492b2b] uppercase bg-[#ece1d4]">
            <tr>
              {['Fecha', 'Tipo', 'Likes', 'Comentarios', 'Compartidos', 'Alcance', 'Engagement', 'Acciones'].map(h => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f5efe9]'} border-b`}>
                <td className="px-2 py-2"><input type="date" value={row.fecha} onChange={(e) => handleUpdate(row.id, 'fecha', e.target.value)} className="w-full border rounded px-2 py-1 bg-white" /></td>
                <td className="px-2 py-2"><input type="text" value={row.tipo} onChange={(e) => handleUpdate(row.id, 'tipo', e.target.value)} className="w-full border rounded px-2 py-1 bg-white" /></td>
                <td className="px-2 py-2"><input type="number" value={row.likes} onChange={(e) => handleUpdate(row.id, 'likes', e.target.value)} className="w-20 border rounded px-2 py-1 bg-white" /></td>
                <td className="px-2 py-2"><input type="number" value={row.comentarios} onChange={(e) => handleUpdate(row.id, 'comentarios', e.target.value)} className="w-20 border rounded px-2 py-1 bg-white" /></td>
                <td className="px-2 py-2"><input type="number" value={row.compartidos} onChange={(e) => handleUpdate(row.id, 'compartidos', e.target.value)} className="w-20 border rounded px-2 py-1 bg-white" /></td>
                <td className="px-2 py-2"><input type="number" value={row.alcance} onChange={(e) => handleUpdate(row.id, 'alcance', e.target.value)} className="w-20 border rounded px-2 py-1 bg-white" /></td>
                <td className="px-4 py-3 font-bold text-[#841f82]">{calculateEngagement(row)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(row.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
             {data.length === 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500">
                        No hay datos de seguimiento. ¡Agrega una fila para comenzar!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackingView;