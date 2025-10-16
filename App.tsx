
import React, { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContentPlanner from './components/ContentPlanner';
import Login from './components/Login';
import { Usuario } from './types';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  const handleLogin = (usuario: Usuario) => {
    setUsuarioActual(usuario);
  };

  const handleLogout = () => {
    setUsuarioActual(null);
  };

  // Si no hay usuario autenticado, mostrar pantalla de login
  if (!usuarioActual) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <ContentPlanner usuario={usuarioActual} onLogout={handleLogout} />
      <SpeedInsights />
    </div>
  );
};

export default App;
