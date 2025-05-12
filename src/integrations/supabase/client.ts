
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use hardcoded values as fallback if environment variables are not available
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hgzsyjaovltugazgatna.supabase.co"
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnenN5amFvdmx0dWdhemdhdG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjU3NDUsImV4cCI6MjA1OTMwMTc0NX0._UsAJ-AK9nwH85sIr9R4Avha_60j4_OfY9saTEVSD3s"

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables are missing. Using default values.');
}

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export const getSupabaseUrl = () => VITE_SUPABASE_URL;
export const getSupabaseAuth = () => supabase.auth;

// Función para limpiar el estado de autenticación
export const cleanupAuthState = () => {
  // Eliminar todos los tokens de autenticación de Supabase
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // También eliminar de sessionStorage si se está usando
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};
