import React, { useState, useEffect } from 'react';
import { Usuario, Configuracion, ROLES } from '../types';
import { storageService } from '../services/storage';

interface AdminPanelProps {
  usuarioActual: Usuario;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ usuarioActual }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [config, setConfig] = useState<Configuracion>({
    tema: 'default',
    colores: {
      primario: '#3b82f6',
      secundario: '#1e40af',
      fondo: '#ece1d4',
      texto: '#1f2937'
    },
    funcionalidades: ['calendar', 'metrics', 'distribution', 'tracking']
  });
  const [nuevoUsuario, setNuevoUsuario] = useState<Partial<Usuario>>({
    nombre: '',
    email: '',
    password: '',
    rol: 'editor'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setUsuarios(storageService.obtenerUsuarios());
    setConfig(storageService.obtenerConfig());
  };

  const guardarConfig = () => {
    storageService.guardarConfig(config);
    alert('Configuración guardada correctamente');
    // Aplicar cambios en tiempo real
    document.documentElement.style.setProperty('--color-primario', config.colores.primario);
    document.documentElement.style.setProperty('--color-secundario', config.colores.secundario);
    document.documentElement.style.setProperty('--color-fondo', config.colores.fondo);
    document.documentElement.style.setProperty('--color-texto', config.colores.texto);
  };

  const agregarUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      alert('Por favor complete todos los campos');
      return;
    }

    const usuario: Usuario = {
      id: Date.now().toString(),
      nombre: nuevoUsuario.nombre!,
      email: nuevoUsuario.email!,
      password: nuevoUsuario.password!,
      rol: nuevoUsuario.rol!,
      activo: true,
      fechaCreacion: new Date().toISOString()
    };

    const nuevosUsuarios = [...usuarios, usuario];
    storageService.guardarUsuarios(nuevosUsuarios);
    setUsuarios(nuevosUsuarios);
    setNuevoUsuario({ nombre: '', email: '', password: '', rol: 'editor' });
  };

  const toggleUsuarioActivo = (id: string) => {
    const nuevosUsuarios = usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    );
    storageService.guardarUsuarios(nuevosUsuarios);
    setUsuarios(nuevosUsuarios);
  };

  const eliminarUsuario = (id: string) => {
    if (id === usuarioActual.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }
    
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    storageService.guardarUsuarios(nuevosUsuarios);
    setUsuarios(nuevosUsuarios);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Gestión de Usuarios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
        
        {/* Formulario para agregar usuario */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 border rounded"
            value={nuevoUsuario.nombre}
            onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 border rounded"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-3 py-2 border rounded"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
          />
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border rounded flex-1"
              value={nuevoUsuario.rol}
              onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value as Usuario['rol']})}
            >
              {ROLES.map(rol => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
            <button
              onClick={agregarUsuario}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Rol</th>
                <th className="py-2 px-4 border-b">Estado</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td className="py-2 px-4 border-b">{usuario.nombre}</td>
                  <td className="py-2 px-4 border-b">{usuario.email}</td>
                  <td className="py-2 px-4 border-b">{usuario.rol}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded ${
                      usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => toggleUsuarioActivo(usuario.id)}
                      className={`px-3 py-1 rounded ${
                        usuario.activo 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      disabled={usuario.id === usuarioActual.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuración del Tema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Configuración del Tema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Color Primario</label>
            <input
              type="color"
              value={config.colores.primario}
              onChange={(e) => setConfig({
                ...config,
                colores: {...config.colores, primario: e.target.value}
              })}
              className="w-full h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Color Secundario</label>
            <input
              type="color"
              value={config.colores.secundario}
              onChange={(e) => setConfig({
                ...config,
                colores: {...config.colores, secundario: e.target.value}
              })}
              className="w-full h-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color de Fondo</label>
            <input
              type="color"
              value={config.colores.fondo}
              onChange={(e) => setConfig({
                ...config,
                colores: {...config.colores, fondo: e.target.value}
              })}
              className="w-full h-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color de Texto</label>
            <input
              type="color"
              value={config.colores.texto}
              onChange={(e) => setConfig({
                ...config,
                colores: {...config.colores, texto: e.target.value}
              })}
              className="w-full h-10"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Funcionalidades Activas</label>
          <div className="space-y-2">
            {['calendar', 'metrics', 'distribution', 'tracking'].map(func => (
              <label key={func} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.funcionalidades.includes(func)}
                  onChange={(e) => {
                    const nuevasFunc = e.target.checked
                      ? [...config.funcionalidades, func]
                      : config.funcionalidades.filter(f => f !== func);
                    setConfig({...config, funcionalidades: nuevasFunc});
                  }}
                  className="rounded"
                />
                <span className="capitalize">{func}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={guardarConfig}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;