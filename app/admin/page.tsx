import TopBar from '@/components/admin/TopBar';
import { getDashboardStats, getProfile } from '@/lib/queries';
import { FolderKanban, Briefcase, Award, Zap, Plus, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const [stats, profile] = await Promise.all([getDashboardStats(), getProfile()]);

    const statCards = [
        { label: 'Projects', value: stats.projectsCount, icon: FolderKanban, href: '/admin/projects' },
        { label: 'Experience', value: stats.experienceCount, icon: Briefcase, href: '/admin/experience' },
        { label: 'Certifications', value: stats.certificationsCount, icon: Award, href: '/admin/certifications' },
        { label: 'Skills', value: stats.skillsCount, icon: Zap, href: '/admin/skills' },
    ];

    const quickActions = [
        { label: 'Add Project', href: '/admin/projects', icon: Plus },
        { label: 'Add Experience', href: '/admin/experience', icon: Plus },
        { label: 'Edit Profile', href: '/admin/profile', icon: Plus },
    ];

    return (
        <>
            <TopBar title="Dashboard" breadcrumb="Admin / Overview" />

            <div className="p-6 space-y-8">
                {/* Welcome */}
                <div>
                    <h2 className="text-2xl font-display font-light text-text-primary">
                        Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Here&apos;s an overview of your portfolio content.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="admin-card flex items-center gap-4 hover:border-accent/30 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <card.icon size={22} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-display font-light text-text-primary">
                                    {card.value}
                                </p>
                                <p className="text-xs text-text-secondary">{card.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions + Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="admin-card">
                        <h3 className="text-sm font-body font-medium text-text-primary mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-elevated text-sm text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    <action.icon size={16} className="text-accent" />
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="admin-card space-y-4">
                        <h3 className="text-sm font-body font-medium text-text-primary">
                            Portfolio Info
                        </h3>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-accent hover:underline"
                        >
                            <ExternalLink size={14} />
                            View Live Portfolio
                        </a>

                        {profile?.updated_at && (
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Clock size={12} />
                                Last updated: {new Date(profile.updated_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
