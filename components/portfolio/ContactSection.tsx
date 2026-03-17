'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Copy, Check, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface ContactSectionProps {
    profile: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleCopy = async () => {
        if (!profile?.email) return;
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        toast.success('Email copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate send — replace with real Server Action or API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Message sent! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSending(false);
    };

    const socialLinks = [
        { icon: Github, url: profile?.github_url, label: 'GitHub' },
        { icon: Linkedin, url: profile?.linkedin_url, label: 'LinkedIn' },
        { icon: Twitter, url: profile?.twitter_url, label: 'X / Twitter' },
        { icon: Mail, url: profile?.email ? `mailto:${profile.email}` : null, label: 'Email' },
    ].filter((l) => l.url);

    return (
        <section id="contact" ref={sectionRef} className="relative py-32 px-6 bg-bg-secondary/30">
            <div className="max-w-4xl mx-auto text-center">
                <motion.p
                    className="section-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                >
          // 05 CONTACT
                </motion.p>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl md:text-6xl font-display font-light text-text-primary leading-tight">
                        Let&apos;s build something
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-display font-light italic text-accent">
                        remarkable.
                    </h2>
                </motion.div>

                {/* Email */}
                {profile?.email && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-3 text-lg md:text-2xl font-body text-text-secondary hover:text-accent transition-colors group"
                        >
                            {profile.email}
                            {copied ? (
                                <Check size={18} className="text-green-400" />
                            ) : (
                                <Copy size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                            aria-label={link.label}
                        >
                            <link.icon size={16} />
                            {link.label}
                        </a>
                    ))}
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-8 text-left space-y-5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="contact-name" className="block text-sm text-text-secondary mb-1.5">
                                Name
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="admin-input"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm text-text-secondary mb-1.5">
                                Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="admin-input"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contact-subject" className="block text-sm text-text-secondary mb-1.5">
                            Subject
                        </label>
                        <input
                            id="contact-subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="admin-input"
                            placeholder="What's this about?"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="block text-sm text-text-secondary mb-1.5">
                            Message
                        </label>
                        <textarea
                            id="contact-message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="admin-input resize-none"
                            placeholder="Tell me about your project..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg-primary text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {sending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Send Message
                            </>
                        )}
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
