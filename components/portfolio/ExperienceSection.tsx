'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';

interface ExperienceSectionProps {
    experience: Experience[];
}

type FilterType = 'all' | 'experience' | 'formation';

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [filter, setFilter] = useState<FilterType>('all');

    const filtered =
        filter === 'all'
            ? experience
            : experience.filter((e) => e.type === filter);

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Work', value: 'experience' },
        { label: 'Education', value: 'formation' },
    ];

    return (
        <section id="experience" ref={sectionRef} className="relative py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                >
          // 02 EXPERIENCE
                </motion.p>

                {/* Filter Tabs */}
                <motion.div
                    className="flex gap-2 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 }}
                >
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className="relative px-5 py-2 text-sm rounded-full transition-colors"
                        >
                            {filter === f.value && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span
                                className={`relative z-10 ${filter === f.value ? 'text-accent' : 'text-text-secondary'
                                    }`}
                            >
                                {f.label}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center line */}
                    <div className="hidden md:block timeline-line" />
                    {/* Mobile line */}
                    <div className="md:hidden absolute left-[20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {filtered.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                                    className={`relative flex items-start gap-8 ${index % 2 === 0
                                            ? 'md:flex-row'
                                            : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:block timeline-dot" style={{ top: '24px' }} />
                                    {/* Mobile dot */}
                                    <div className="md:hidden absolute left-[14px] top-6 w-[14px] h-[14px] rounded-full bg-accent border-[3px] border-bg-primary z-10">
                                        <span className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-ring" />
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`glass-card p-6 flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'
                                            }`}
                                    >
                                        {/* Type badge */}
                                        <div className="flex items-center gap-2 mb-3">
                                            {item.type === 'experience' ? (
                                                <Briefcase size={14} className="text-accent" />
                                            ) : (
                                                <GraduationCap size={14} className="text-accent" />
                                            )}
                                            <span className="text-xs font-mono text-accent uppercase tracking-wider">
                                                {item.type === 'experience' ? 'Work' : 'Education'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-body font-medium text-text-primary">
                                            {item.title}
                                        </h3>

                                        {item.organization && (
                                            <p className="text-text-secondary text-sm mt-1">
                                                {item.organization}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-secondary">
                                            {item.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {item.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatDateRange(item.start_date, item.end_date, item.is_current)}
                                            </span>
                                        </div>

                                        {item.description && (
                                            <p className="text-text-secondary text-sm mt-4 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-4">
                                                {item.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-xs font-mono rounded bg-accent/10 text-accent/80"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <p className="text-center text-text-secondary py-12">
                            No entries to display.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
