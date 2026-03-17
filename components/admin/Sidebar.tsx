'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    User,
    FolderKanban,
    Briefcase,
    Award,
    Zap,
    Settings,
    LogOut,
    ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Skills', href: '/admin/skills', icon: Zap },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
    userName?: string | null;
}

export default function Sidebar({ userName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-bg-secondary transition-all duration-300',
                collapsed ? 'w-16' : 'w-60'
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {!collapsed && (
                    <span className="font-display text-lg font-light tracking-wider text-text-primary">
                        Portfolio
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-bg-elevated text-text-secondary transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <ChevronLeft
                        size={18}
                        className={cn('transition-transform', collapsed && 'rotate-180')}
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        item.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                                isActive
                                    ? 'bg-accent/10 text-accent border-l-2 border-accent'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-3">
                {!collapsed && userName && (
                    <p className="text-xs text-text-secondary mb-2 truncate px-1">{userName}</p>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
