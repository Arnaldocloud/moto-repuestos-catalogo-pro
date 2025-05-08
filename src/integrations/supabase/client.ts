
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use hardcoded values as fallback if environment variables are not available
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY 

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables are missing. Using default values.');
}

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY
);

export const getSupabaseUrl = () => VITE_SUPABASE_URL;
export const getSupabaseAuth = () => supabase.auth;
