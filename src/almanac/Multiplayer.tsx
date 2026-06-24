import { observer } from 'mobx-react';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { useStore } from '../stores/RootStore';
import supabase from '../supabase';
import { camera } from './camera';
import { connectPresence, makeSelf, PresenceHandle } from './presence';

/** Stable orbit phase per peer so multiple listeners fan out around a planet. */
function angleFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((h >>> 0) % 360) * (Math.PI / 180);
}

/**
 * Multiplayer presence layer. Announces which planet we're tuned to and renders
 * other listeners as little ships orbiting the planet they're on. No-op (renders
 * nothing) when there's no live Supabase backend.
 */
const Multiplayer = observer((): React.JSX.Element | null => {
  const store = useStore();
  const shipRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const handleRef = useRef<PresenceHandle | null>(null);

  // Join the presence channel once.
  useEffect(() => {
    if (!supabase) return;
    const handle = connectPresence(supabase, makeSelf(), (peers) => store.setPeers(peers));
    handleRef.current = handle;
    return () => {
      handle.disconnect();
      handleRef.current = null;
      store.setPeers([]);
    };
  }, [store]);

  // Broadcast which planet we're tuned into whenever it changes.
  const listeningTo = store.isPlaying ? store.selectedId : '';
  useEffect(() => {
    handleRef.current?.setListening(listeningTo);
  }, [listeningTo]);

  // Reposition peer ships every frame — they orbit the planet they're on,
  // projected through our (panning) camera. Refs only, no per-frame re-render.
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (const peer of store.peers) {
        const el = shipRefs.current.get(peer.id);
        if (!el) continue;
        const world = peer.listeningTo ? store.worldById(peer.listeningTo) : undefined;
        if (!world) {
          el.style.display = 'none';
          continue;
        }
        const a = angleFor(peer.id) + t * 0.0006;
        const sx = world.x + Math.cos(a) * 48 - camera.x + cx;
        const sy = world.y + Math.sin(a) * 48 - camera.y + cy;
        el.style.display = 'block';
        el.style.transform = `translate(${sx}px, ${sy}px)`;
      }
    };
    loop(0);
    return () => cancelAnimationFrame(raf);
  }, [store]);

  return (
    <div className="dh-peers">
      {store.peers.map((p) => (
        <div
          className="peer"
          key={p.id}
          ref={(el) => {
            if (el) shipRefs.current.set(p.id, el);
            else shipRefs.current.delete(p.id);
          }}
          style={{ ['--c' as string]: p.color } as React.CSSProperties}
        >
          <div className="peer-ship" />
          <div className="peer-label">{p.name}</div>
        </div>
      ))}
    </div>
  );
});

export default Multiplayer;
