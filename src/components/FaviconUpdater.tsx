import { useEffect } from 'react';

const FaviconUpdater = () => {
  useEffect(() => {
    // Crear un enlace para el favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/favicon.png';
    
    // Eliminar cualquier favicon existente
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(el => el.remove());
    
    // Agregar el nuevo favicon
    document.head.appendChild(link);
    
    // Limpiar al desmontar
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return null; // Este componente no renderiza nada
};

export default FaviconUpdater;
