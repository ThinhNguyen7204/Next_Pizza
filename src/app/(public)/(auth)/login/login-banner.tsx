'use client'
import Logo from "@/components/logo";
import { motion } from 'framer-motion';

export default function LoginBanner() {
  return (
    <div className="relative z-10 text-center px-12 space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
        <Logo href="/" size="xl" variant="gold" />
        <div className="w-16 h-px bg-primary/30 mx-auto mt-8 mb-6" />
        <p className="font-serif italic text-cream/60 text-xl leading-relaxed max-w-sm mx-auto">
          &ldquo;Where every slice tells a story of passion and tradition.&rdquo;
        </p>
      </motion.div>
    </div>
  )
}