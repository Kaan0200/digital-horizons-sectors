/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase = undefined;
let supabaseUrl;
let supabaseKey;

// DEV
try {
    supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via meta.env');
}

// PROD
try {
    if (!supabaseUrl) {
        supabaseUrl = process.env.VITE_APP_SUPABASE_URL;
    }
    if (!supabaseKey) {
        supabaseKey = process.env.VITE_APP_SUPABASE_ANON_KEY;
    }
} catch (e: unknown) {
    console.error('Unable to retrieve env variables, via process.env');
}

// create client library
try {
    supabase = createClient(supabaseUrl || '', supabaseKey || '');
} catch (e: unknown) {
    console.error('[DH App] Unable to connect multiplayer. Unable to create supabase client.');
}


export default supabase;
