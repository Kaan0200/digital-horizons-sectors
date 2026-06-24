// Minimal shim: p5 v2 ships without bundled types we rely on here. We use the
// instance-mode API loosely, so treat the sketch instance as `any`.
declare module 'p5' {
  const p5: any;
  export default p5;
}
