/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@supabase/supabase-js';

let supabaseUrl;
let supabaseKey;
let supabase;

// DEV
try {
    supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON;
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via meta.env');
}

// PROD
try {
    supabaseUrl = process.env.VITE_APP_SUPABASE_URL;
    supabaseKey = process.env.VITE_APP_SUPABASE_ANON_KEY;
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via process.env');
}

// create client library
try {
    supabase = createClient(supabaseUrl || '', supabaseKey || '');
} catch (e: unknown) {
    console.error('Unable to create supabase client lib');
}

export default supabase;
