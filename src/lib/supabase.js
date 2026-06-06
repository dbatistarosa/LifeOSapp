import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xdsfqkzokripprqmnzag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkc2Zxa3pva3JpcHBycW1uemFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDY0NDMsImV4cCI6MjA5NjI4MjQ0M30.4v_yuQhQ6q14Aci7K8D4vprH0r5t5qODdZuh4TX6a94';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Automatically handle OAuth/Magic Link callbacks
  },
});

export default supabase;
