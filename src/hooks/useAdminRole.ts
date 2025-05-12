
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para verificar si el usuario actual tiene rol de administrador
 * @returns Un objeto con el estado de administrador y si está cargando
 */
export const useAdminRole = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Verifica si el usuario actual tiene rol de administrador
   * @returns true si el usuario es administrador, false en caso contrario
   */
  const checkAdminRole = async (): Promise<boolean> => {
    try {
      // Obtener la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        console.log("No hay sesión activa o usuario");
        return false;
      }
      
      console.log("Verificando rol de administrador para el usuario:", session.user.id);
      
      // Consultar si el usuario tiene rol de administrador en la tabla user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();
        
      if (error) {
        console.log("Error al verificar rol de administrador:", error);
        return false;
      }
      
      console.log("Resultado de la consulta de rol:", data);
      return Boolean(data);
    } catch (error) {
      console.error("Error al verificar rol de administrador:", error);
      return false;
    }
  };

  /**
   * Obtiene el estado de administrador del usuario actual
   */
  const fetchAdminStatus = async () => {
    setLoading(true);
    const adminStatus = await checkAdminRole();
    console.log("Estado de administrador:", adminStatus);
    setIsAdmin(adminStatus);
    setLoading(false);
  };
  
  // Verificar el rol al montar el componente
  useEffect(() => {
    fetchAdminStatus();
    
    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchAdminStatus();
    });
    
    // Limpieza al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { isAdmin, loading };
};
