import React, { useState } from 'react';
import { Usuario } from '../types';
import { storageService } from '../services/storage';

interface LoginProps {
  onLogin: (usuario: Usuario) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usuarios = storageService.obtenerUsuarios();
    
    // Si no hay usuarios, crear uno admin por defecto
    if (usuarios.length === 0) {
      const usuarioAdmin: Usuario = {
        id: '1',
        nombre: 'Administrador',
        email: 'admin@acafe.com',
        password: 'admin123',
        rol: 'admin',
        activo: true,
        fechaCreacion: new Date().toISOString()
      };
      storageService.guardarUsuarios([usuarioAdmin]);
      usuarios.push(usuarioAdmin);
    }

    const usuario = usuarios.find((u: Usuario) => 
      u.email === email && u.password === password && u.activo
    );

    if (usuario) {
      onLogin(usuario);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ACAFE Content Planner
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          <p>Credenciales por defecto:</p>
          <p>Email: admin@acafe.com</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;