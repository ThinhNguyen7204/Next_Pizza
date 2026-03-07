import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        <p className="cursive text-primary text-5xl">404</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
          Page Not Found
        </h1>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-charcoal text-cream text-xs uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
