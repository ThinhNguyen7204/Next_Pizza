export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-charcoal/10 border-t-gold rounded-full animate-spin mx-auto" />
        <p className="tech-label text-charcoal/50">Loading...</p>
      </div>
    </div>
  );
}
