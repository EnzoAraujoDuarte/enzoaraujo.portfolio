/**
 * Real 35mm grain over the flat ink surfaces. The tile is measurably seamless,
 * so a plain repeat has no visible edge; a generated feTurbulence never quite
 * gets the clumping right.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: 'url(/Images/art/grain-256.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  );
}
