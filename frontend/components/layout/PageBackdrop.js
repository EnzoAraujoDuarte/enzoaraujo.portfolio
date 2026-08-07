export default function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat opacity-20"
      style={{ backgroundImage: 'url(/Images/griddistortion.webp)' }}
    />
  );
}
