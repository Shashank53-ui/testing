'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const phrases = [
    {
        main: "140,000 companies can sponsor visas.",
        highlight: "The real question: will they choose you?",
        sub: "Getlanded increases your odds by targeting the right employers."
    },
    {
        main: "Stop guessing—find jobs from",
        highlight: "companies that actually sponsor visas.",
        sub: "Every listing is verified against the official Home Office register."
    },
    {
        main: "Discover 20,000+ real jobs",
        highlight: "— all in one place.",
        sub: "We monitor 150+ ATS platforms so you don't have to."
    },
    {
        main: "Know before you apply.",
        highlight: "Identify companies that sponsor visas.",
        sub: "Save hundreds of hours of manual research with our unified database."
    },
    {
        main: "Built for international talent,",
        highlight: "by international students.",
        sub: "We've been through the struggle. We built the solution we needed."
    }
];

export default function PhraseCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[360px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-5xl px-4"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight mb-8 italic font-sans">
                        {phrases[index].main}<br />
                        <span className="text-brand-600">
                            {phrases[index].highlight}
                        </span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic"
                    >
                        {phrases[index].sub}
                    </motion.p>
                </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div className="absolute bottom-4 flex gap-2">
                {phrases.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-brand-600' : 'w-2 bg-slate-200'}`}
                    />
                ))}
            </div>
        </div>
    );
}
