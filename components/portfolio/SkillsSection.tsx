'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Cpu } from 'lucide-react';
import type { Skill } from '@/types';
import { getLevelOpacity } from '@/lib/utils';

interface SkillsSectionProps {
    skills: Skill[];
}

const levelColors: Record<string, string> = {
    Expert: 'bg-green-500/20 text-green-400 border-green-500/30',
    Advanced: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Beginner: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    const skillSet = skills.filter((s) => s.category === 'skill');
    const techStack = skills.filter((s) => s.category === 'tech');

    return (
        <section ref={sectionRef} className="relative py-32 px-6 bg-bg-secondary/50">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                >
          // SKILLS & TECH
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Layers size={20} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-display font-light text-text-primary">
                                Skills
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {skillSet.map((skill, i) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="glass-card p-4 flex items-center justify-between"
                                >
                                    <span className="text-sm font-body text-text-primary">{skill.name}</span>
                                    <div className="flex items-center gap-3">
                                        {/* Progress bar */}
                                        <div className="w-24 h-1.5 bg-bg-primary rounded-full overflow-hidden hidden sm:block">
                                            <motion.div
                                                className="h-full rounded-full bg-accent"
                                                initial={{ width: 0 }}
                                                animate={inView ? { width: `${getLevelOpacity(skill.level) * 100}%` } : {}}
                                                transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                                            />
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 text-[10px] rounded border ${levelColors[skill.level] || ''}`}
                                        >
                                            {skill.level}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Cpu size={20} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-display font-light text-text-primary">
                                Tech Stack
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {techStack.map((tech, i) => (
                                <motion.div
                                    key={tech.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.5 + i * 0.05 }}
                                    className="glass-card p-4 flex items-center justify-between"
                                >
                                    <span className="text-sm font-body text-text-primary">{tech.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-bg-primary rounded-full overflow-hidden hidden sm:block">
                                            <motion.div
                                                className="h-full rounded-full bg-accent"
                                                initial={{ width: 0 }}
                                                animate={inView ? { width: `${getLevelOpacity(tech.level) * 100}%` } : {}}
                                                transition={{ delay: 0.7 + i * 0.05, duration: 0.8 }}
                                            />
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 text-[10px] rounded border ${levelColors[tech.level] || ''}`}
                                        >
                                            {tech.level}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {skills.length === 0 && (
                    <p className="text-center text-text-secondary py-12">
                        No skills to display yet.
                    </p>
                )}
            </div>
        </section>
    );
}
