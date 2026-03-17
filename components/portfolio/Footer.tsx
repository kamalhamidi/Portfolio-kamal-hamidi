'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import type { Profile } from '@/types';

interface FooterProps {
    profile: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowTop(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative border-t border-border py-8 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-secondary font-body">
                    {profile?.full_name || 'Portfolio'}
                </p>

                <p className="text-xs text-text-secondary/60 font-body">
                    Built with Next.js & Supabase
                </p>

                <div className="flex items-center gap-4">
                    <p className="text-sm text-text-secondary font-body">
                        © {new Date().getFullYear()}
                    </p>

                    <a
                        href="/admin/login"
                        className="text-xs text-text-secondary/10 hover:text-text-secondary/100 transition-opacity duration-300"
                    >
                        Admin
                    </a>
                </div>
            </div>

            {/* Back to top */}
            <AnimatePresence>
                {showTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-accent text-bg-primary shadow-lg hover:opacity-90 transition-opacity"
                        aria-label="Back to top"
                    >
                        <ArrowUp size={18} />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
}
