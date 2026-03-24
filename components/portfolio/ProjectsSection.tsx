'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectsSectionProps {
    projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [showAll, setShowAll] = useState(false);

    const featured = projects.find((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    const visibleProjects = showAll ? rest : rest.slice(0, 6);

    return (
        <section id="projects" ref={sectionRef} className="relative py-32 px-6 bg-bg-secondary/50">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                >
          // 03 PROJECTS
                </motion.p>

                {/* Featured Project */}
                {featured && (
                    <motion.div
                        className="glass-card overflow-hidden mb-16"
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Image */}
                            <div className="relative h-64 lg:h-auto overflow-hidden bg-bg-elevated">
                                {featured.image_url ? (
                                    <img
                                        src={featured.image_url}
                                        alt={featured.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl font-display font-light text-accent/20">
                                            {featured.name[0]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star size={14} className="text-accent fill-accent" />
                                    <span className="text-xs font-mono text-accent uppercase tracking-wider">
                                        Featured Project
                                    </span>
                                </div>

                                <h3 className="text-3xl font-display font-light text-text-primary mb-4">
                                    {featured.name}
                                </h3>

                                <p className="text-text-secondary font-body leading-relaxed mb-6">
                                    {featured.long_description || featured.description}
                                </p>

                                {featured.tags && featured.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {featured.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 text-xs font-mono rounded bg-accent/10 text-accent/80"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    {featured.github_url && (
                                        <a
                                            href={featured.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-text-primary hover:text-accent transition-colors"
                                        >
                                            <Github size={16} />
                                            Source
                                        </a>
                                    )}
                                    {featured.live_url && (
                                        <a
                                            href={featured.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            <ExternalLink size={16} />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            className="h-full"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <div className="glass-card overflow-hidden group h-[420px] flex flex-col">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-bg-elevated">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt={project.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-display font-light text-accent/20">
                                                {project.name[0]}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                        <div className="flex gap-2">
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full glass text-text-primary hover:text-accent transition-colors"
                                                    aria-label={`View ${project.name} source code`}
                                                >
                                                    <Github size={18} />
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a
                                                    href={project.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full glass text-text-primary hover:text-accent transition-colors"
                                                    aria-label={`View ${project.name} live demo`}
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                                    <h4 className="text-lg font-body font-medium text-text-primary mb-2 line-clamp-1">
                                        {project.name}
                                    </h4>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-accent/10 text-accent/70"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More */}
                {rest.length > 6 && !showAll && (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8 }}
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-8 py-3 rounded-full glass text-sm text-text-primary hover:text-accent hover:border-accent/30 transition-all"
                        >
                            Load More Projects
                        </button>
                    </motion.div>
                )}

                {projects.length === 0 && (
                    <p className="text-center text-text-secondary py-12">
                        No projects to display yet.
                    </p>
                )}
            </div>
        </section>
    );
}
