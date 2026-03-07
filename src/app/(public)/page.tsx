'use client'

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-charcoal rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="space-y-8">
            <div className="space-y-2">
              <p className="tech-label text-primary">FIG. 1 — The Signature</p>
              <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tight">
                Truffle <br />
                <span className="cursive text-7xl md:text-9xl text-primary -ml-4">Symphony</span>
              </h1>
            </div>
            <p className="font-sans text-lg md:text-xl text-charcoal/80 max-w-md font-light leading-relaxed">
              A masterpiece of culinary architecture. Hand-stretched artisanal crust, black truffle
              cream, fior di latte, and 24-month aged Parmigiano-Reggiano.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Link
                href="/products"
                className="group flex items-center gap-4 bg-charcoal text-cream px-8 py-4 rounded-full hover:bg-primary transition-colors duration-500"
              >
                <span className="font-sans text-sm tracking-widest uppercase">Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col">
                <span className="font-serif italic text-primary text-3xl tracking-wider pr-4">380,000₫</span>
                <span className="tech-label">Size: 30cm</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.5, ease: 'easeOut' }} className="relative">
            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl border border-charcoal/5">
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000"
                alt="Truffle Symphony Pizza"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute top-1/4 -right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-charcoal/10">
              <p className="tech-label">01 — Black Truffle</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute bottom-1/4 -left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-charcoal/10">
              <p className="tech-label">02 — Artisanal Crust</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Transition: Light → Dark ═══ */}
      <section className="relative z-10 w-full bg-linear-to-b from-cream to-dark py-32 md:py-48 flex items-center justify-center overflow-hidden -mb-1">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="block text-xs uppercase tracking-[0.4em] text-charcoal/60 mb-8 font-medium font-sans">
              The Philosophy
            </span>
            <h2 className="font-serif font-light italic tracking-wide text-3xl md:text-5xl lg:text-6xl text-charcoal leading-relaxed mb-10">
              &ldquo;Dough is patience, fire is instinct — <br />
              the rest is <span className="cursive not-italic text-5xl md:text-6xl lg:text-8xl text-primary mx-2 relative top-2">soul.</span>&rdquo;
            </h2>
            <div className="w-px h-24 bg-linear-to-b from-charcoal/20 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ Process Section — 5 Steps with Panel Design ═══ */}
      <section className="bg-dark text-cream py-24 md:py-32 -mt-1 relative">
        {/* Glow Decor */}
        <div className="absolute top-1/4 left-0 w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[60vw] h-[60vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

        {/* Vertical Lines Decor */}
        <div className="absolute top-0 bottom-0 left-12 w-px bg-white/5 pointer-events-none hidden md:block" />
        <div className="absolute top-0 bottom-0 right-12 w-px bg-white/5 pointer-events-none hidden md:block" />

        {/* Section Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-24 md:mb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70 font-bold">The Craft</p>
            <h2 className="text-5xl md:text-6xl font-serif">
              How We Make <span className="cursive text-primary leading-[1.15]">Perfection</span>
            </h2>
            <p className="font-sans text-white/80 opacity-90 font-light leading-relaxed max-w-xl mx-auto italic text-sm md:text-base">
              Every La Pizzaia pizza is a labour of love. Five deliberate steps stand between
              raw ingredients and the moment it reaches your table.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto px-6 space-y-32 md:space-y-48 relative z-10">
          {[
            {
              step: '01',
              numeral: 'I',
              title: 'The Ferment',
              tag: '72-Hour Cold Proof',
              desc: 'We begin 3 days before your pizza is baked. Our dough — made from Italian 00 flour, natural starter, and filtered water — rests at 4°C for a minimum of 72 hours. Slow fermentation develops complex flavour and creates the characteristic air pockets that make our crust so light.',
              image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
            },
            {
              step: '02',
              numeral: 'II',
              title: 'The Stretch',
              tag: 'Never Rolled',
              desc: 'Our pizzaiolo stretches each dough ball by hand using the traditional Neapolitan slap technique. No rolling pins, no machines. The air stays trapped inside, the crust stays uneven in the most beautiful way — thin at the centre, pillowy at the rim.',
              image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=1200',
            },
            {
              step: '03',
              numeral: 'III',
              title: 'The Sauce',
              tag: 'San Marzano DOP',
              desc: 'San Marzano DOP tomatoes — exclusively grown in volcanic soil near Mount Vesuvius — are crushed by hand and slow-cooked for six hours with sea salt, fresh basil, and a drizzle of Italian extra-virgin olive oil. No sugar, no artificial anything.',
              image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=1200',
            },
            {
              step: '04',
              numeral: 'IV',
              title: 'The Crown',
              tag: 'Curated Toppings',
              desc: "We source only what's excellent. Buffalo mozzarella from Campania. Prosciutto di Parma, 24-month aged. Black truffles from Umbria in season. Each topping is placed deliberately — because the way a pizza looks before it enters the oven matters.",
              image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=1200',
            },
            {
              step: '05',
              numeral: 'V',
              title: 'The Fire',
              tag: '450°C — 90 Seconds',
              desc: 'Our dome-shaped wood-fired oven — handbuilt in Naples and imported for this sole purpose — reaches 450°C. The pizza is launched on a wooden peel, rotated once at 45 seconds, and pulled at 90. The crust blisters. The cheese melts perfectly. The rest is flavour.',
              image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=1200',
            },
          ].map((item, idx) => (
            <div key={item.step} className="relative group min-h-[500px] flex items-center">
              {/* Background Image Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1 }}
                className={`absolute inset-0 w-full md:w-[70%] lg:w-[65%] h-full rounded-2xl overflow-hidden ${idx % 2 !== 0 ? 'md:right-0 md:left-auto' : 'left-0'}`}
              >
                <div className="absolute inset-0 bg-dark/20 z-10 transition-colors duration-700 group-hover:bg-transparent" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>

              {/* Text Panel */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`relative z-20 w-[calc(100vw-3rem)] md:w-[450px] lg:w-[500px] p-8 md:p-12 
                           bg-[#0A0A0A]/80 backdrop-blur-md shadow-2xl shadow-black/50 border-l border-gold/30
                           ${idx % 2 === 0 ? 'ml-auto mr-4 md:mr-10' : 'mr-auto ml-4 md:ml-10'} mt-32 md:mt-0`}
              >

                <div className="space-y-6 relative z-10">
                  {/* Indicators */}
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-3xl text-primary font-bold scale-110">{item.numeral}</span>
                    <div className="flex-1 flex items-center gap-1 opacity-40">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <div key={rIdx} className={`h-[2px] flex-1 ${rIdx === idx ? 'bg-primary/60' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Title Area */}
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.4em] text-primary font-medium mb-3">
                      {item.tag}
                    </span>
                    <h3 className="font-serif font-light text-4xl md:text-5xl lg:text-5xl text-white leading-[1.15]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <p className="font-sans font-light italic text-sm md:text-base text-white/80 opacity-90 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Action */}
                  <div className="pt-4">
                    <Link
                      href="/products"
                      className="group/btn inline-flex flex-col gap-1"
                    >
                      <span className="text-xs uppercase tracking-[0.25em] font-medium text-white group-hover/btn:text-primary transition-colors">
                        Explore Menu
                      </span>
                      <div className="h-px w-0 bg-primary group-hover/btn:w-full transition-all duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Transition: Dark → Light ═══ */}
      <section className="relative z-10 w-full bg-linear-to-b from-dark to-cream py-32 md:py-48 flex items-center justify-center overflow-hidden -mt-1">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="block text-xs uppercase tracking-[0.4em] text-white/40 mb-8 font-medium font-sans">
              From Oven to Table
            </span>
            <h2 className="font-serif font-light italic tracking-wide text-3xl md:text-5xl lg:text-6xl text-white/90 leading-relaxed mb-10">
              &ldquo;Ninety seconds in flame, <br />
              a lifetime of <span className="cursive not-italic text-5xl md:text-6xl lg:text-8xl text-primary mx-2 relative top-2">amore.</span>&rdquo;
            </h2>
            <div className="w-px h-24 bg-linear-to-b from-gold/40 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>


      {/* Gallery Section */}
      {/* <section className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <p className="tech-label text-primary">The Collection</p>
            <h2 className="text-5xl font-serif">Artisanal Creations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((pizza, idx) => (
              <motion.div
                key={pizza._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl mb-6">
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src={pizza.image ?? ''}
                    alt={pizza.product_name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Link href={`/product/${pizza._id}`} className="bg-white text-charcoal px-6 py-2 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-2xl">{pizza.product_name}</h3>
                    <span className="font-serif italic text-primary text-lg tracking-wider">{pizza.price.toLocaleString()}₫</span>
                  </div>
                  <p className="font-sans text-sm text-charcoal/60 font-light">{pizza.description}</p>
                  <p className="tech-label mt-2">{pizza.menu_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link href="/products" className="inline-flex items-center gap-4 border border-charcoal px-8 py-4 rounded-full hover:bg-charcoal hover:text-cream transition-colors duration-300">
              <span className="font-sans text-sm tracking-widest uppercase">View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  )
}