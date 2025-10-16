import { createClient } from '@supabase/supabase-js';

// DEV
let supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
let supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

// PROD
if (!supabaseUrl) {
    supabaseUrl = process.env.VITE_APP_SUPABASE_URL;
}
if (!supabaseKey) {
    supabaseKey = process.env.VITE_APP_SUPABASE_ANON_KEY;
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;
