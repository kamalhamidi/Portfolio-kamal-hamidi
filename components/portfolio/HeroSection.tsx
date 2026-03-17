'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ArrowRight, Download } from 'lucide-react';
import type { Profile } from '@/types';

interface HeroSectionProps {
    profile: Profile | null;
}

function TypewriterText({ texts }: { texts: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const tick = useCallback(() => {
        const currentWord = texts[currentIndex] || '';

        if (!isDeleting) {
            setDisplayText(currentWord.substring(0, displayText.length + 1));
            if (displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), 2000);
                return;
            }
        } else {
            setDisplayText(currentWord.substring(0, displayText.length - 1));
            if (displayText === '') {
                setIsDeleting(false);
                setCurrentIndex((prev) => (prev + 1) % texts.length);
                return;
            }
        }
    }, [currentIndex, displayText, isDeleting, texts]);

    useEffect(() => {
        const speed = isDeleting ? 50 : 100;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting]);

    return (
        <span className="text-accent">
            {displayText}
            <span className="animate-typewriter-cursor text-accent">|</span>
        </span>
    );
}

export default function HeroSection({ profile }: HeroSectionProps) {
    const firstName = profile?.full_name?.split(' ')[0] || 'ALEX';
    const lastName = profile?.full_name?.split(' ').slice(1).join(' ') || 'RIVERA';
    const roles = profile?.roles?.length ? profile.roles : ['Developer'];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
            {/* Background blobs */}
            <div className="gradient-blob gradient-blob-1" />
            <div className="gradient-blob gradient-blob-2" />
            <div className="gradient-blob gradient-blob-3 opacity-[0.08]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Content — Left */}
                    <motion.div
                        className="lg:col-span-7 space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Name */}
                        <motion.div variants={itemVariants}>
                            <h1 className="font-display font-light tracking-[0.15em]">
                                <span className="block gradient-text-shimmer" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 1 }}>
                                    {firstName.toUpperCase()}
                                </span>
                                <span className="block text-text-primary" style={{ fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 1 }}>
                                    {lastName.toUpperCase()}
                                </span>
                            </h1>
                        </motion.div>

                        {/* Typewriter */}
                        <motion.div variants={itemVariants} className="text-xl md:text-2xl font-body font-light">
                            <TypewriterText texts={roles} />
                        </motion.div>

                        {/* Location + Availability */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                            {profile?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-accent" />
                                    {profile.location}
                                </span>
                            )}
                            {profile?.availability && (
                                <span className="flex items-center gap-1.5">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                                    </span>
                                    Open to work
                                </span>
                            )}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            {profile?.cv_url && (
                                <a
                                    href={profile.cv_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-text-primary text-sm hover:bg-white/5 transition-all duration-200"
                                >
                                    <Download size={16} />
                                    Download CV
                                </a>
                            )}
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg-primary text-sm font-medium hover:opacity-90 transition-all duration-200"
                            >
                                Contact Me
                                <ArrowRight size={16} />
                            </a>
                            <a
                                href="#projects"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm text-text-secondary hover:text-accent transition-colors group"
                            >
                                View Projects
                                <span className="block w-8 h-[1px] bg-text-secondary group-hover:bg-accent group-hover:w-12 transition-all duration-300" />
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Photo — Right */}
                    <motion.div
                        className="lg:col-span-5 flex justify-center relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            {/* Rotating ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30 animate-spin-slow" />
                            {/* Glow */}
                            <div className="absolute inset-4 rounded-full bg-accent/5 blur-2xl" />
                            {/* Photo circle */}
                            <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-accent/20 bg-bg-secondary">
                                {profile?.photo_url ? (
                                    <img
                                        src={profile.photo_url}
                                        alt={profile.full_name || 'Profile'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl font-display font-light text-accent/30">
                                        {firstName[0]}
                                        {lastName[0]}
                                    </div>
                                )}
                            </div>
                            {/* Experience badge */}
                            {profile?.years_experience && (
                                <motion.div
                                    className="absolute -right-2 top-8 bg-accent text-bg-primary px-4 py-2 rounded-lg font-body text-sm font-medium"
                                    style={{ rotate: '15deg' }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, type: 'spring' }}
                                >
                                    {profile.years_experience}+ yrs exp
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <ChevronDown size={24} className="text-text-secondary animate-scroll-hint" />
            </motion.div>
        </section>
    );
}
