'use client';

import { ExternalLink } from 'lucide-react';

interface TopBarProps {
    title: string;
    breadcrumb?: string;
    action?: React.ReactNode;
}

export default function TopBar({ title, breadcrumb, action }: TopBarProps) {
    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-bg-secondary/50">
            <div>
                {breadcrumb && (
                    <p className="text-xs text-text-secondary font-mono mb-0.5">{breadcrumb}</p>
                )}
                <h1 className="text-lg font-body font-medium text-text-primary">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {action}
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-accent border border-border rounded-lg hover:border-accent/30 transition-all"
                >
                    <ExternalLink size={12} />
                    View Site
                </a>
            </div>
        </header>
    );
}
