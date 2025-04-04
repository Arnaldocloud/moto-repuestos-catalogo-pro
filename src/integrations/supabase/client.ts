import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Cargar variables de entorno VITE (nunca asignar valores aquí)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación para desarrollo (opcional pero recomendado)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan variables de Supabase. Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env'
  );
}

// Inicializar cliente Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funciones auxiliares
export const getSupabaseUrl = () => SUPABASE_URL;
export const getSupabaseAuth = () => supabase.auth;