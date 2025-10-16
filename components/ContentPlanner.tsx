
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, Download, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

import { Publicacion, TrackingEntry, ActiveTab } from '../types';
import { generateCalendar } from '../utils/dataGenerator';
import { exportToCSV } from '../utils/csvExporter';
import CalendarView from './CalendarView';
import AddPostModal from './AddPostModal';
import MetricsView from './MetricsView';
import DistributionView from './DistributionView';
import TrackingView from './TrackingView';

const ContentPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>(generateCalendar());
  const [trackingData, setTrackingData] = useState<TrackingEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addNewPub = useCallback((newPubData: Omit<Publicacion, 'id' | 'redSocial' | 'estado'>) => {
    const newPub: Publicacion = {
      ...newPubData,
      id: `pub-${Date.now()}`,
      redSocial: "Instagram",
      estado: "Programado"
    };
    setPublicaciones(prev => [...prev, newPub].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()));
    setShowAddModal(false);
  }, []);

  const updatePub = useCallback((updatedPub: Publicacion) => {
    setPublicaciones(prev => prev.map(p => p.id === updatedPub.id ? updatedPub : p));
  }, []);

  const deletePub = useCallback((id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      setPublicaciones(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  const addTrackingRow = useCallback(() => {
    const newRow: TrackingEntry = {
      id: `track-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Post',
      likes: 0,
      comentarios: 0,
      compartidos: 0,
      alcance: 0
    };
    setTrackingData(prev => [...prev, newRow]);
  }, []);

  const updateTrackingRow = useCallback((id: string, field: keyof TrackingEntry, value: string | number) => {
    setTrackingData(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  }, []);
  
  const deleteTrackingRow = useCallback((id: string) => {
     setTrackingData(prev => prev.filter(t => t.id !== id));
  }, []);


  const metrics = useMemo(() => {
    const porTipo: { [key: string]: number } = {};
    const porTema: { [key: string]: number } = {};
    const semanas = new Set(publicaciones.map(p => p.semana));
    
    publicaciones.forEach(pub => {
      porTipo[pub.tipoContenido] = (porTipo[pub.tipoContenido] || 0) + 1;
      porTema[pub.temaCentral] = (porTema[pub.temaCentral] || 0) + 1;
    });
    
    return {
        totalPublicaciones: publicaciones.length,
        totalSemanas: semanas.size,
        totalTipos: Object.keys(porTipo).length,
        totalTemas: Object.keys(porTema).length,
        porTipo,
        porTema,
        porSemana: Array.from(semanas).reduce((acc, semana) => {
            // FIX: Type 'unknown' cannot be used as an index type. Explicitly cast 'semana' to a number.
            acc[Number(semana)] = publicaciones.filter(p => p.semana === semana).length;
            return acc;
        }, {} as {[key: number]: number})
    };
  }, [publicaciones]);

  const tabs = [
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'metrics', label: 'Métricas', icon: TrendingUp },
    { id: 'distribution', label: 'Distribución', icon: PieChart },
    { id: 'tracking', label: 'Seguimiento', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-2">ACAFE</h1>
              <p className="text-amber-700">Planificador de Contenido | Oct - Dic 2025</p>
            </div>
            <button
              onClick={() => exportToCSV(publicaciones)}
              className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Exportar CSV
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-amber-50 p-4 rounded-lg text-center"><p className="text-amber-600 text-sm">Total Publicaciones</p><p className="text-3xl font-bold text-amber-900">{metrics.totalPublicaciones}</p></div>
            <div className="bg-orange-50 p-4 rounded-lg text-center"><p className="text-orange-600 text-sm">Semanas</p><p className="text-3xl font-bold text-orange-900">{metrics.totalSemanas}</p></div>
            <div className="bg-red-50 p-4 rounded-lg text-center"><p className="text-red-600 text-sm">Tipos Contenido</p><p className="text-3xl font-bold text-red-900">{metrics.totalTipos}</p></div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center"><p className="text-yellow-600 text-sm">Temas</p><p className="text-3xl font-bold text-yellow-900">{metrics.totalTemas}</p></div>
          </div>
        </header>
        
        <main className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex-grow flex items-center justify-center gap-2 px-4 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-inner'
                    : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="p-4 sm:p-6">
            {activeTab === 'calendar' && <CalendarView publicaciones={publicaciones} onAdd={() => setShowAddModal(true)} onUpdate={updatePub} onDelete={deletePub} />}
            {activeTab === 'metrics' && <MetricsView metrics={metrics} />}
            {activeTab === 'distribution' && <DistributionView metrics={metrics} />}
            {activeTab === 'tracking' && <TrackingView data={trackingData} onAdd={addTrackingRow} onUpdate={updateTrackingRow} onDelete={deleteTrackingRow} />}
          </div>
        </main>
      </div>

      {showAddModal && (
        <AddPostModal
          onClose={() => setShowAddModal(false)}
          onAdd={addNewPub}
        />
      )}
    </div>
  );
};

export default ContentPlanner;
