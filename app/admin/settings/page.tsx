'use client';

import { useEffect, useState, useCallback } from 'react';
import TopBar from '@/components/admin/TopBar';
import { createClient } from '@/lib/supabase/client';
import { updateAccentColor } from '@/lib/actions';
import { toast } from 'sonner';
import { Palette, Download, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import type { Profile } from '@/types';

const presetColors = [
    '#00d4ff', '#7b61ff', '#ff6b9d', '#00ff88',
    '#ffaa00', '#ff4444', '#44aaff', '#aa44ff',
];

export default function SettingsPage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [accentColor, setAccentColor] = useState('#00d4ff');
    const [savingColor, setSavingColor] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchProfile = useCallback(async () => {
        const { data } = await supabase.from('profiles').select('*').limit(1).single();
        if (data) {
            setProfile(data as Profile);
            setAccentColor((data as Profile).accent_color || '#00d4ff');
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleColorSave = async () => {
        if (!profile) return;
        setSavingColor(true);
        const result = await updateAccentColor(profile.id, accentColor);
        if (result.success) {
            toast.success('Accent color updated!');
        } else {
            toast.error(result.error || 'Failed');
        }
        setSavingColor(false);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const [profiles, projects, experience, certifications, skills] = await Promise.all([
                supabase.from('profiles').select('*'),
                supabase.from('projects').select('*'),
                supabase.from('experience').select('*'),
                supabase.from('certifications').select('*'),
                supabase.from('skills').select('*'),
            ]);

            const exportData = {
                exported_at: new Date().toISOString(),
                profiles: profiles.data,
                projects: projects.data,
                experience: experience.data,
                certifications: certifications.data,
                skills: skills.data,
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Data exported!');
        } catch {
            toast.error('Export failed');
        }
        setExporting(false);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data.projects) {
                for (const project of data.projects) {
                    const { id, ...rest } = project;
                    await supabase.from('projects').upsert({ id, ...rest });
                }
            }
            if (data.experience) {
                for (const exp of data.experience) {
                    const { id, ...rest } = exp;
                    await supabase.from('experience').upsert({ id, ...rest });
                }
            }
            if (data.certifications) {
                for (const cert of data.certifications) {
                    const { id, ...rest } = cert;
                    await supabase.from('certifications').upsert({ id, ...rest });
                }
            }
            if (data.skills) {
                for (const skill of data.skills) {
                    const { id, ...rest } = skill;
                    await supabase.from('skills').upsert({ id, ...rest });
                }
            }

            toast.success('Data imported successfully!');
        } catch {
            toast.error('Import failed — invalid JSON');
        }
    };

    if (loading) {
        return (
            <>
                <TopBar title="Settings" breadcrumb="Admin / Settings" />
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-accent" size={24} />
                </div>
            </>
        );
    }

    return (
        <>
            <TopBar title="Settings" breadcrumb="Admin / Settings" />

            <div className="p-6 max-w-3xl space-y-6">
                {/* Accent Color */}
                <div className="admin-card space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette size={18} className="text-accent" />
                        <h3 className="text-sm font-body font-medium text-text-primary">Accent Color</h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {presetColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setAccentColor(color)}
                                className="w-10 h-10 rounded-full border-2 transition-all"
                                style={{
                                    backgroundColor: color,
                                    borderColor: accentColor === color ? 'white' : 'transparent',
                                    transform: accentColor === color ? 'scale(1.15)' : 'scale(1)',
                                }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                        <label className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors">
                            <span className="text-xs text-text-secondary">+</span>
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="sr-only"
                            />
                        </label>
                    </div>

                    {/* Preview */}
                    <div className="p-4 rounded-lg bg-bg-primary border border-border">
                        <p className="text-xs text-text-secondary mb-2">Preview</p>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-display" style={{ color: accentColor }}>
                                Portfolio
                            </span>
                            <button
                                className="px-4 py-1.5 rounded-lg text-sm font-medium text-bg-primary"
                                style={{ backgroundColor: accentColor }}
                            >
                                Button
                            </button>
                            <span
                                className="px-2 py-0.5 rounded text-xs border"
                                style={{ borderColor: accentColor, color: accentColor }}
                            >
                                Tag
                            </span>
                        </div>
                    </div>

                    <button onClick={handleColorSave} disabled={savingColor} className="admin-btn admin-btn-primary">
                        {savingColor ? <Loader2 size={14} className="animate-spin" /> : null}
                        {savingColor ? 'Saving...' : 'Save Color'}
                    </button>
                </div>

                {/* Export / Import */}
                <div className="admin-card space-y-4">
                    <h3 className="text-sm font-body font-medium text-text-primary">Data Management</h3>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={handleExport} disabled={exporting} className="admin-btn admin-btn-secondary">
                            <Download size={14} />
                            {exporting ? 'Exporting...' : 'Export as JSON'}
                        </button>

                        <label className="admin-btn admin-btn-secondary cursor-pointer">
                            <Upload size={14} />
                            Import from JSON
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="admin-card border-red-500/20 space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-400" />
                        <h3 className="text-sm font-body font-medium text-red-400">Danger Zone</h3>
                    </div>

                    <p className="text-xs text-text-secondary">
                        This action will delete all projects, experience, certifications, and skills.
                        Profile data will be preserved.
                    </p>

                    <button
                        onClick={async () => {
                            if (!confirm('Are you absolutely sure? This will delete all your content data.')) return;
                            await Promise.all([
                                supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                                supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                                supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                                supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                            ]);
                            toast.success('All content data cleared');
                        }}
                        className="admin-btn admin-btn-danger"
                    >
                        Reset All Content
                    </button>
                </div>
            </div>
        </>
    );
}
