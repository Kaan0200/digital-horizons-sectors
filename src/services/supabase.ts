import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for Realtime presence (multiplayer). Exported as nullable:
 * if env vars are missing or the client can't be built, this is `null` and the
 * app runs fine solo — callers must null-check. No Postgres tables are needed;
 * presence rides the Realtime websocket.
 */
const url = import.meta.env.VITE_APP_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

if (url && key) {
  try {
    client = createClient(url, key, {
      realtime: { params: { eventsPerSecond: 5 } },
      auth: { persistSession: false },
    });
  } catch (e) {
    console.warn('[DH] Could not create Supabase client; multiplayer disabled.', e);
    client = null;
  }
} else {
  console.info('[DH] Supabase env not set; multiplayer disabled.');
}

export const supabase = client;
export default client;
