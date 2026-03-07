'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
}

const sizeMap = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const variantMap = {
  dark: 'text-charcoal',
  light: 'text-cream',
  gold: 'text-primary',
};

export default function Logo({ className = '', href = '/', size = 'md', variant = 'dark' }: LogoProps) {
  const content = (
    <span className={`inline-flex flex-col items-center leading-none group ${className}`}>
      <span className={`cursive ${sizeMap[size]} ${variantMap[variant]} tracking-wider transition-colors duration-300 group-hover:text-primary`}>
        La Pizzaia
      </span>
      <span className="block text-[8px] uppercase tracking-[0.5em] text-primary/60 font-sans font-medium mt-0.5">
        Pizzeria
      </span>
    </span>
  );
  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
