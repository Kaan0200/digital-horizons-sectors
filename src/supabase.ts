/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseUrl;
let supabaseKey;

// DEV
try {
    supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON;
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via meta.env');
}

// PROD
try {
    supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via process.env');
}

// create client library
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;
