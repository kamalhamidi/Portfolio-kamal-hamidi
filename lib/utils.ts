import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateRange(
    startDate: string | null,
    endDate: string | null,
    isCurrent: boolean
): string {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    if (!start) return end || '';
    return `${start} — ${end}`;
}

export function getAccentWithOpacity(accent: string, opacity: number): string {
    const hex = accent.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getLevelOpacity(level: string): number {
    switch (level) {
        case 'Expert':
            return 1;
        case 'Advanced':
            return 0.7;
        case 'Intermediate':
            return 0.4;
        case 'Beginner':
            return 0.2;
        default:
            return 0.3;
    }
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
