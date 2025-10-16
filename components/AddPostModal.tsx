import React, { useState } from 'react';
import { X, Check, UploadCloud, Trash2 } from 'lucide-react';
import { Publicacion, TEMAS, TIPOS, DIAS } from '../types';

interface AddPostModalProps {
  onClose: () => void;
  onAdd: (newPub: Omit<Publicacion, 'id' | 'redSocial' | 'estado'>) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ onClose, onAdd }) => {
  const [newPub, setNewPub] = useState({
    semana: 1,
    fecha: '',
    dia: 'Lunes',
    hora: '09:00',
    temaCentral: TEMAS[0],
    tipoContenido: 'Post',
    descripcion: '',
    imageUrl: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

  const processFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`Tipo de archivo no válido. Por favor, sube un PNG, JPG, o GIF.`);
        return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`El archivo es demasiado grande. El tamaño máximo es ${MAX_FILE_SIZE_MB}MB.`);
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setNewPub(prev => ({ ...prev, imageUrl: reader.result as string }));
    }
    reader.readAsDataURL(file);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeImage = () => {
    setNewPub(prev => ({ ...prev, imageUrl: '' }));
    // Also clear the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };


  const handleSubmit = () => {
      if (!newPub.fecha || !newPub.descripcion) {
          alert('Por favor, completa la fecha y la descripción.');
          return;
      }
      onAdd(newPub);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#492b2b]">Nueva Publicación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semana</label>
              <input type="number" value={newPub.semana} onChange={(e) => setNewPub({...newPub, semana: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#841f82]" min="1"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" value={newPub.fecha} onChange={(e) => setNewPub({...newPub, fecha: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#841f82]"/>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
              <select value={newPub.dia} onChange={(e) => setNewPub({...newPub, dia: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#841f82]">{DIAS.map(d => <option key={d} value={d}>{d}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input type="time" value={newPub.hora} onChange={(e) => setNewPub({...newPub, hora: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#841f82]"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema Central</label>
            <select value={newPub.temaCentral} onChange={(e) => setNewPub({...newPub, temaCentral: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#841f82]">{TEMAS.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contenido</label>
            <select value={newPub.tipoContenido} onChange={(e) => setNewPub({...newPub, tipoContenido: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#841f82]">{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={newPub.descripcion} onChange={(e) => setNewPub({...newPub, descripcion: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#841f82]" rows={3}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Post</label>
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors ${isDragging ? 'bg-[#f5efe9] border-[#841f82]' : ''}`}
            >
                <div className="space-y-1 text-center">
                    {newPub.imageUrl ? (
                      <div className="relative group mx-auto">
                        <img src={newPub.imageUrl} alt="Previsualización" className="mx-auto h-24 w-auto rounded-md shadow-md"/>
                        <button 
                          onClick={removeImage}
                          type="button"
                          aria-label="Eliminar imagen"
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#841f82] hover:text-[#6a1969] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#841f82]">
                            <span>Sube un archivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button onClick={handleSubmit} className="flex-1 bg-[#841f82] text-white px-6 py-3 rounded-lg hover:bg-[#6a1969] transition-colors flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg">
            <Check size={20} /> Agregar Publicación
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;