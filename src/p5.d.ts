// Minimal shim: p5 v2 ships without bundled types we rely on here.
declare module 'p5' {
    const p5: unknown;
    export default p5;
}
