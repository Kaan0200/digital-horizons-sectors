/**
 * Shared, mutable camera for the star chart.
 *
 * The camera updates every animation frame as the user pans. That is FAR too
 * often to flow through React state, so it lives here as a plain mutable object
 * that both the StarMap (writer) and the p5 TopoField (reader) import directly.
 * Nothing here triggers a re-render.
 *
 * `camera.{x,y}` is the world point currently centred in the viewport.
 */
export const camera = { x: 0, y: 0 };
export const camVel = { x: 0, y: 0 };

/** Pending glide target; the StarMap loop eases toward it then clears it. */
export const camState: { warp: { x: number; y: number } | null } = { warp: null };

/** Smoothly glide the chart so (x, y) ends up centred. */
export function warpTo(x: number, y: number): void {
  camState.warp = { x, y };
}

/** Glide back to the origin sector. */
export function recenter(): void {
  warpTo(0, 0);
}
