'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Profile, Skill } from '@/types';
import { getLevelOpacity } from '@/lib/utils';

interface AboutSectionProps {
    profile: Profile | null;
    skills: Skill[];
}

function AnimatedCounter({ value, label }: { value: number; label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = value;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <div ref={ref} className="text-center">
            <span className="block text-4xl md:text-5xl font-display font-light text-accent">
                {count}+
            </span>
            <span className="block text-sm text-text-secondary font-body mt-1">{label}</span>
        </div>
    );
}

function TechMarquee({ skills }: { skills: Skill[] }) {
    const techSkills = skills.filter((s) => s.category === 'tech');
    const names = techSkills.length > 0 ? techSkills.map((s) => s.name) : ['React', 'Next.js', 'TypeScript', 'Node.js'];
    const doubled = [...names, ...names];

    return (
        <div className="overflow-hidden py-6">
            <div className="marquee-track animate-marquee-left">
                {doubled.map((name, i) => (
                    <span
                        key={`${name}-${i}`}
                        className="text-sm font-mono text-text-secondary/60 whitespace-nowrap"
                    >
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function AboutSection({ profile, skills }: AboutSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    const stats = [
        { value: profile?.years_experience ?? 0, label: 'Years Experience' },
        { value: profile?.projects_count ?? 0, label: 'Projects' },
        { value: profile?.clients_count ?? 0, label: 'Clients' },
        { value: skills.length, label: 'Skills' },
    ];

    const skillItems = skills.filter((s) => s.category === 'skill');

    return (
        <section id="about" ref={sectionRef} className="relative py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
          // 01 ABOUT
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-2 gap-8">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <AnimatedCounter value={stat.value} label={stat.label} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bio + Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <p className="text-text-secondary font-body text-lg leading-relaxed">
                            {profile?.bio || 'A passionate developer crafting exceptional digital experiences.'}
                        </p>

                        {/* Skill Tags */}
                        {skillItems.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skillItems.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-3 py-1.5 rounded-full text-xs font-mono glass"
                                        style={{
                                            borderColor: `rgba(0, 212, 255, ${getLevelOpacity(skill.level)})`,
                                            color: `rgba(0, 212, 255, ${Math.max(getLevelOpacity(skill.level), 0.5)})`,
                                        }}
                                    >
                                        {skill.name} • {skill.level}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Tech Marquee */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 }}
                    className="mt-16 border-t border-b border-border"
                >
                    <TechMarquee skills={skills} />
                </motion.div>
            </div>
        </section>
    );
}
