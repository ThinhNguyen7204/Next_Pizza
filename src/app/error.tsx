"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        <p className="cursive text-primary text-4xl">Oops</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
          Something went wrong
        </h1>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-charcoal text-cream text-xs uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-charcoal/20 text-charcoal text-xs uppercase tracking-widest hover:border-charcoal/50 transition-colors"
          >
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="tech-label text-charcoal/40 pt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
