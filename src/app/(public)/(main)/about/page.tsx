"use client";

import { motion } from "framer-motion";
import Image from "next/image";
// import PageHero from "@/shared/components/ui/PageHero";
import { Utensils, Flame, Leaf } from "lucide-react";

const STORY = [
  {
    year: "2018",
    title: "The Beginning",
    desc: "Born from a passion for authentic Neapolitan pizza, La Pizzaia started as a tiny kitchen in District 1, Ho Chi Minh City.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
  },
  {
    year: "2020",
    title: "The Oven",
    desc: "We imported a handmade wood-fired oven from Naples, reaching 450°C — the secret behind our 90-second blistered crust.",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&q=80&w=800",
  },
  {
    year: "2023",
    title: "The Recognition",
    desc: '"Named "Best Artisan Pizza in Saigon" by Vietnam Food Guide. Our 72-hour fermented dough became legendary.',
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
  },
  {
    year: "2025",
    title: "The Future",
    desc: "Expanding our craft. New seasonal menus, a rooftop terrace, and a commitment to sourcing only the finest ingredients.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
  },
];

const VALUES = [
  {
    title: "Craftsmanship",
    desc: "Every pizza is hand-stretched, never machine-pressed. Mastery takes time, and we refuse to take shortcuts.",
    icon: Utensils,
  },
  {
    title: "Ingredients",
    desc: "San Marzano tomatoes, Italian 00 flour, and seasonal local produce. We source only what's excellent.",
    icon: Leaf,
  },
  {
    title: "Tradition",
    desc: "Neapolitan techniques perfected over generations, yet adapted thoughtfully for the modern palate.",
    icon: Flame,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* <PageHero
                label="Our Story"
                title={<>Crafted with <span className="cursive text-gold">Love</span></>}
                subtitle="La Pizzaia is more than a pizzeria — it's a love letter to the art of dough, fire, and flavour. Every slice tells our story."
            /> */}

      {/* ═══ Transition: Light → Dark ═══ */}
      <section className="relative z-10 w-full bg-linear-to-b from-cream to-dark py-32 md:py-44 flex items-center justify-center overflow-hidden -mb-1">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="block text-xs uppercase tracking-[0.4em] text-charcoal/60 mb-8 font-medium font-sans">
              Est. 2018 — Saigon
            </span>
            <h2 className="font-serif font-light italic tracking-wide text-3xl md:text-5xl lg:text-6xl text-charcoal leading-relaxed mb-10">
              &ldquo;We didn&apos;t open a restaurant — <br />
              we lit a <span className="cursive not-italic text-5xl md:text-6xl lg:text-8xl text-gold mx-2 relative top-2">fire.</span>&rdquo;
            </h2>
            <div className="w-px h-24 bg-linear-to-b from-charcoal/20 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ Timeline: Sticky Scrolling Layout ═══ */}
      <section className="bg-dark text-cream py-24 md:py-40 -mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
            {/* Sticky Left Sidebar */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:sticky lg:top-40 space-y-6"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">Timeline</p>
                <h2 className="font-serif text-5xl md:text-7xl leading-tight">
                  The <br className="hidden lg:block" />
                  <span className="cursive text-gold italic">Journey</span>
                </h2>
                <div className="w-24 h-px bg-primary/30 mt-8" />
                <p className="font-sans text-cream/50 font-light leading-relaxed max-w-sm pt-6 hidden lg:block">
                  From a tiny kitchen testing dough recipes late into the night, to becoming a beloved destination for true artisanal pizza. Here is our story, chapter by chapter.
                </p>
              </motion.div>
            </div>

            {/* Scrolling Right Content */}
            <div className="lg:col-span-7 space-y-32">
              {STORY.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="group relative"
                >
                  <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex items-center gap-6">
                      <span className="font-serif italic text-gold text-4xl md:text-5xl">{item.year}</span>
                      <div className="h-px flex-1 bg-linear-to-r from-gold/30 to-transparent" />
                    </div>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                      <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    </div>

                    <div className="space-y-3 pr-8 md:pr-16">
                      <h3 className="font-serif text-3xl md:text-4xl text-white/90">{item.title}</h3>
                      <p className="font-sans text-cream/60 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Transition: Dark → Light ═══ */}
      <section className="relative z-10 w-full bg-linear-to-b from-dark to-cream py-32 md:py-48 flex items-center justify-center overflow-hidden -mt-1">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="block text-xs uppercase tracking-[0.4em] text-white/40 mb-8 font-medium font-sans">
              Our Promise
            </span>
            <h2 className="font-serif font-light italic tracking-wide text-3xl md:text-5xl lg:text-6xl text-white/90 leading-relaxed mb-10">
              &ldquo;The best ingredients, <br />
              the simplest <span className="cursive not-italic text-5xl md:text-6xl lg:text-8xl text-gold mx-2 relative top-2">truth.</span>&rdquo;
            </h2>
            <div className="w-px h-24 bg-linear-to-b from-gold/40 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ Values: Modern Editorial Layout ═══ */}
      <section className="py-24 md:py-32 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">Philosophy</p>
              <h2 className="font-serif text-5xl md:text-6xl text-charcoal">What We Stand For</h2>
            </div>
            <p className="font-sans text-charcoal/50 font-light max-w-sm italic">
              There are no shortcuts in our kitchen. Just pure passion and reverence for the craft.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-charcoal/10">
            {VALUES.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className={`group p-8 md:p-12 transition-colors duration-500 hover:bg-white
                                      ${idx !== 2 ? 'lg:border-r border-charcoal/10' : ''}
                                      ${idx !== 0 ? 'border-t lg:border-t-0 border-charcoal/10' : ''}
                                    `}
                >
                  <div className="flex justify-between items-start mb-16">
                    <span className="font-serif text-5xl text-gold/20 font-light tracking-tighter group-hover:text-gold transition-colors duration-500">
                      0{idx + 1}
                    </span>
                    <div className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/40 group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-500">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-3xl text-charcoal">{v.title}</h3>
                    <p className="font-sans text-charcoal/60 font-light leading-relaxed">
                      {v.desc}
                    </p>
                  </div>

                  <div className="h-px w-0 bg-primary mt-12 group-hover:w-full transition-all duration-700 ease-out" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
