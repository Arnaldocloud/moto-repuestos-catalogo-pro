
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas que solo deben ser accesibles por administradores
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useAdminRole();

  // Si está cargando, mostrar un indicador
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-motorcycle-red border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Verificando permisos...</p>
      </div>
    );
  }

  // Si no es administrador, redirigir a la página principal
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Para propósitos de prueba/desarrollo, siempre permitir el acceso (comentar en producción)
  // return <>{children}</>;

  // Si es administrador, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
