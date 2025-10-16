import React, { useState, useEffect } from 'react';
import { Publicacion, ActiveTab, Usuario } from '../types';
import { storageService } from '../services/storage';
import CalendarView from './CalendarView';
import MetricsView from './MetricsView';
import DistributionView from './DistributionView';
import TrackingView from './TrackingView';
import AdminPanel from './AdminPanel';
import Login from './Login';

const ContentPlanner: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  useEffect(() => {
    if (usuarioActual) {
      cargarPublicaciones();
    }
  }, [usuarioActual]);

  const cargarPublicaciones = () => {
    const publicacionesGuardadas = storageService.obtenerPublicaciones();
    setPublicaciones(publicacionesGuardadas);
  };

  const guardarPublicaciones = (nuevasPublicaciones: Publicacion[]) => {
    setPublicaciones(nuevasPublicaciones);
    storageService.guardarPublicaciones(nuevasPublicaciones);
  };

  const handleLogin = (usuario: Usuario) => {
    setUsuarioActual(usuario);
  };

  const handleLogout = () => {
    setUsuarioActual(null);
  };

  if (!usuarioActual) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ACAFE Content Planner
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {usuarioActual.nombre} ({usuarioActual.rol})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            {['calendar', 'metrics', 'distribution', 'tracking'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as ActiveTab)}
                className={`py-2 px-3 rounded-t-lg capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'calendar' ? 'Calendario' :
                 tab === 'metrics' ? 'Métricas' :
                 tab === 'distribution' ? 'Distribución' :
                 'Seguimiento'}
              </button>
            ))}
            
            {usuarioActual.rol === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-2 px-3 rounded-t-lg ${
                  activeTab === 'admin'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Administración
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'calendar' && (
          <CalendarView
            publicaciones={publicaciones}
            onSave={guardarPublicaciones}
          />
        )}
        
        {activeTab === 'metrics' && (
          <MetricsView publicaciones={publicaciones} />
        )}
        
        {activeTab === 'distribution' && (
          <DistributionView publicaciones={publicaciones} />
        )}
        
        {activeTab === 'tracking' && (
          <TrackingView publicaciones={publicaciones} />
        )}
        
        {activeTab === 'admin' && usuarioActual.rol === 'admin' && (
          <AdminPanel usuarioActual={usuarioActual} />
        )}
      </main>
    </div>
  );
};

export default ContentPlanner;