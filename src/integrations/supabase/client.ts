import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error('Faltan variables de entorno de Supabase.');
}

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY
);

export const getSupabaseUrl = () => VITE_SUPABASE_URL;
export const getSupabaseAuth = () => supabase.auth;
