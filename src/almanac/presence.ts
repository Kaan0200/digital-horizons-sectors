/**
 * Realtime presence for the chart — "who else is here, and what are they tuned
 * into." Pure logic over a Supabase Realtime presence channel (no DB tables).
 * The React layer (Multiplayer.tsx) drives this; everything degrades to a no-op
 * when there's no live backend.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export interface Peer {
  id: string;
  color: string;
  name: string;
  /** mix id the peer is currently tuned to ('' = just drifting) */
  listeningTo: string;
}

const ADJ = ['Amber', 'Cobalt', 'Velvet', 'Quiet', 'Halcyon', 'Saffron', 'Rose', 'Ember', 'Pollen', 'Glass', 'Cyan', 'Dusty'];
const NOUN = ['Drifter', 'Voyager', 'Nomad', 'Pilot', 'Comet', 'Skiff', 'Runner', 'Sparrow', 'Moth', 'Kite'];
const HUES = ['#5fc9c1', '#ecb56a', '#e58aa6', '#9d8cf2', '#8fdca0', '#7fd0e6', '#e8956c', '#c79bf0'];

/** A fresh anonymous identity for this browser session. */
export function makeSelf(): Peer {
  const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
  return { id: nanoid(8), color: pick(HUES), name: `${pick(ADJ)} ${pick(NOUN)}`, listeningTo: '' };
}

export interface PresenceHandle {
  /** Update which planet we're tuned to and re-broadcast. */
  setListening: (mixId: string) => void;
  disconnect: () => void;
}

/**
 * Join the presence channel as `self`, calling `onPeers` with the *other*
 * participants whenever the roster changes.
 */
export function connectPresence(client: SupabaseClient, self: Peer, onPeers: (peers: Peer[]) => void): PresenceHandle {
  const channel = client.channel('almanac-presence', { config: { presence: { key: self.id } } });
  let current: Peer = { ...self };

  const sync = () => {
    const raw = channel.presenceState() as Record<string, Array<Partial<Peer>>>;
    const peers: Peer[] = [];
    for (const key of Object.keys(raw)) {
      const metas = raw[key];
      const meta = metas[metas.length - 1];
      if (meta && meta.id && meta.id !== self.id) {
        peers.push({
          id: meta.id,
          color: meta.color ?? '#c9a468',
          name: meta.name ?? 'Wanderer',
          listeningTo: meta.listeningTo ?? '',
        });
      }
    }
    onPeers(peers);
  };

  channel
    .on('presence', { event: 'sync' }, sync)
    .on('presence', { event: 'join' }, sync)
    .on('presence', { event: 'leave' }, sync)
    .subscribe((status) => {
      // Only track once truly subscribed; a paused/dead project simply never
      // reaches SUBSCRIBED and we stay quietly solo.
      if (status === 'SUBSCRIBED') void channel.track(current);
    });

  return {
    setListening: (mixId: string) => {
      current = { ...current, listeningTo: mixId };
      void channel.track(current);
    },
    disconnect: () => {
      void channel.unsubscribe();
      client.removeChannel(channel);
    },
  };
}
