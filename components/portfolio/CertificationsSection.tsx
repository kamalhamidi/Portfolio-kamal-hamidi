'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import type { Certification } from '@/types';
import { formatDate } from '@/lib/utils';

interface CertificationsSectionProps {
    certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section id="certifications" ref={sectionRef} className="relative py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                >
          // 04 CERTIFICATIONS
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="group relative"
                        >
                            <div className="glass-card p-6 h-full flex flex-col justify-between overflow-hidden relative">
                                {/* Corner ribbon */}
                                <div className="corner-ribbon" />

                                {/* Front content (always visible) */}
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                                        <Award size={24} className="text-accent" />
                                    </div>

                                    <h4 className="text-lg font-body font-medium text-text-primary mb-1">
                                        {cert.name}
                                    </h4>

                                    {cert.issuer && (
                                        <p className="text-sm text-text-secondary">{cert.issuer}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-text-secondary mt-4">
                                    <Calendar size={12} />
                                    {formatDate(cert.issue_date)}
                                </div>

                                {/* Hover overlay with credential details */}
                                <div className="absolute inset-0 bg-[#16162a] p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl border border-white/[0.07]">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck size={16} className="text-accent" />
                                            <span className="text-xs font-mono text-accent uppercase tracking-wider">
                                                Credential Details
                                            </span>
                                        </div>

                                        {cert.credential_id && (
                                            <div className="mb-3">
                                                <p className="text-xs text-text-secondary mb-0.5">Credential ID</p>
                                                <p className="text-sm font-mono text-text-primary">{cert.credential_id}</p>
                                            </div>
                                        )}

                                        {cert.issue_date && (
                                            <div className="mb-3">
                                                <p className="text-xs text-text-secondary mb-0.5">Issued</p>
                                                <p className="text-sm text-text-primary">{formatDate(cert.issue_date)}</p>
                                            </div>
                                        )}

                                        {cert.expiry_date && (
                                            <div className="mb-3">
                                                <p className="text-xs text-text-secondary mb-0.5">Expires</p>
                                                <p className="text-sm text-text-primary">{formatDate(cert.expiry_date)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {cert.verify_url && (
                                        <a
                                            href={cert.verify_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:opacity-90 transition-opacity w-fit"
                                        >
                                            <ExternalLink size={14} />
                                            Verify
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {certifications.length === 0 && (
                    <p className="text-center text-text-secondary py-12">
                        No certifications to display yet.
                    </p>
                )}
            </div>
        </section>
    );
}
