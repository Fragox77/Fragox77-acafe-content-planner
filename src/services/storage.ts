export class StorageService {
  private static instance: StorageService;
  private readonly PUBLICACIONES_KEY = 'acafe_publicaciones';
  private readonly USUARIOS_KEY = 'acafe_usuarios';
  private readonly CONFIG_KEY = 'acafe_config';

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Publicaciones
  guardarPublicaciones(publicaciones: any[]): void {
    localStorage.setItem(this.PUBLICACIONES_KEY, JSON.stringify(publicaciones));
  }

  obtenerPublicaciones(): any[] {
    const data = localStorage.getItem(this.PUBLICACIONES_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Usuarios
  guardarUsuarios(usuarios: any[]): void {
    localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(usuarios));
  }

  obtenerUsuarios(): any[] {
    const data = localStorage.getItem(this.USUARIOS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Configuración
  guardarConfig(config: any): void {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  }

  obtenerConfig(): any {
    const data = localStorage.getItem(this.CONFIG_KEY);
    return data ? JSON.parse(data) : {
      tema: 'default',
      funcionalidades: []
    };
  }
}

export const storageService = StorageService.getInstance();