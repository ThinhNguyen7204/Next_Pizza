'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

const EVENTS = [
    {
        id: 1,
        title: 'Pizza Making Workshop',
        date: 'March 15, 2026',
        time: '10:00 AM — 1:00 PM',
        location: 'La Pizzaia Kitchen, District 1',
        description:
            "Learn the art of Neapolitan pizza from our head chef. You'll stretch dough, build your own pizza, and bake it in our 450°C wood-fired oven.",
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 2,
        title: 'Wine & Pizza Pairing Night',
        date: 'March 28, 2026',
        time: '7:00 PM — 10:00 PM',
        location: 'La Pizzaia Rooftop Terrace',
        description:
            'An evening of curated Italian wines paired with exclusive seasonal pizzas. Limited to 30 guests.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 3,
        title: 'Truffle Season Launch',
        date: 'April 10, 2026',
        time: '6:00 PM — 9:00 PM',
        location: 'La Pizzaia Kitchen, District 1',
        description:
            'Celebrate truffle season with a special 5-course tasting menu featuring black and white truffles flown in from Umbria.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    },
];

export default function EventsClient() {
    return (
        <div className="min-h-screen bg-cream">
            <div className="max-w-5xl mx-auto px-6">
                <div className="space-y-16">
                    {EVENTS.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl border border-charcoal/5 shadow-sm overflow-hidden"
                        >
                            <div className="relative w-full h-64 md:h-full min-h-[250px] overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    unoptimized
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 flex flex-col justify-center space-y-5">
                                <h2 className="font-serif text-3xl">{event.title}</h2>
                                <p className="font-sans text-charcoal/60 font-light leading-relaxed">
                                    {event.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-sans text-charcoal/50">
                                        <Calendar className="w-4 h-4 text-gold" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-sans text-charcoal/50">
                                        <Clock className="w-4 h-4 text-gold" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-sans text-charcoal/50">
                                        <MapPin className="w-4 h-4 text-gold" />
                                        {event.location}
                                    </div>
                                </div>
                                <button className="self-start mt-2 px-6 py-3 bg-charcoal text-cream font-sans text-xs tracking-widest uppercase rounded-xl hover:bg-primary transition-colors">
                                    Reserve Spot
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
