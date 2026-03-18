'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/admin/TopBar';
import { createClient } from '@/lib/supabase/client';
import { updateProfile, uploadFile } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import type { Profile } from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newRole, setNewRole] = useState('');

    const fetchProfile = useCallback(async () => {
        const { data } = await supabase.from('profiles').select('*').limit(1).single();
        if (data) setProfile(data as Profile);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'cv') => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', type === 'photo' ? 'avatars' : 'documents');
        formData.append('path', type === 'photo' ? 'profile' : 'cv');

        const result = await uploadFile(formData);
        if (result.success && result.url) {
            const key = type === 'photo' ? 'photo_url' : 'cv_url';
            setProfile({ ...profile, [key]: result.url });
            toast.success(`${type === 'photo' ? 'Photo' : 'CV'} uploaded!`);
        } else {
            toast.error(result.error || 'Upload failed');
        }
    };

    const addRole = () => {
        if (!newRole.trim() || !profile) return;
        setProfile({ ...profile, roles: [...(profile.roles || []), newRole.trim()] });
        setNewRole('');
    };

    const removeRole = (index: number) => {
        if (!profile) return;
        setProfile({ ...profile, roles: profile.roles.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);

        const result = await updateProfile(profile.id, {
            full_name: profile.full_name || '',
            roles: profile.roles || [],
            location: profile.location,
            availability: profile.availability,
            bio: profile.bio,
            email: profile.email,
            github_url: profile.github_url || '',
            linkedin_url: profile.linkedin_url || '',
            twitter_url: profile.twitter_url || '',
            website_url: profile.website_url || '',
            photo_url: profile.photo_url,
            cv_url: profile.cv_url,
            years_experience: profile.years_experience,
            projects_count: profile.projects_count,
            clients_count: profile.clients_count,
            accent_color: profile.accent_color || '#00d4ff',
        });

        if (result.success) {
            toast.success('Profile updated!');
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to save');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <>
                <TopBar title="Profile" breadcrumb="Admin / Profile" />
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-accent" size={24} />
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <TopBar title="Profile" breadcrumb="Admin / Profile" />
                <div className="p-6 text-text-secondary">No profile found. Please seed your database.</div>
            </>
        );
    }

    return (
        <>
            <TopBar
                title="Profile"
                breadcrumb="Admin / Profile"
                action={
                    <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                }
            />

            <div className="p-6 max-w-4xl space-y-8">
                {/* Photo Upload */}
                <div className="admin-card">
                    <h3 className="text-sm font-body font-medium text-text-primary mb-4">Profile Photo</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-bg-elevated border-2 border-border overflow-hidden shrink-0">
                            {profile.photo_url ? (
                                <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl text-accent/30 font-display">
                                    {profile.full_name?.[0] || '?'}
                                </div>
                            )}
                        </div>
                        <label className="admin-btn admin-btn-secondary cursor-pointer">
                            <Upload size={14} />
                            Upload Photo
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'photo')} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="admin-card space-y-4">
                    <h3 className="text-sm font-body font-medium text-text-primary mb-2">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.full_name || ''}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Location</label>
                            <input
                                type="text"
                                value={profile.location || ''}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Email</label>
                            <input
                                type="email"
                                value={profile.email || ''}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                        <div className="flex items-end gap-3">
                            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={profile.availability}
                                    onChange={(e) => setProfile({ ...profile, availability: e.target.checked })}
                                    className="w-4 h-4 accent-[var(--accent)]"
                                />
                                Available for work
                            </label>
                        </div>
                    </div>

                    {/* Roles */}
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Roles (typewriter text)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(profile.roles || []).map((role, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs"
                                >
                                    {role}
                                    <button onClick={() => removeRole(i)} className="hover:text-red-400 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                                className="admin-input flex-1"
                                placeholder="Add a role..."
                            />
                            <button onClick={addRole} className="admin-btn admin-btn-secondary">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Bio</label>
                        <textarea
                            rows={4}
                            value={profile.bio || ''}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="admin-input resize-none"
                        />
                    </div>
                </div>

                <div className="admin-card space-y-4">
                    <h3 className="text-sm font-body font-medium text-text-primary mb-2">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">GitHub</label>
                            <input
                                type="url"
                                value={profile.github_url || ''}
                                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                                className="admin-input"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">LinkedIn</label>
                            <input
                                type="url"
                                value={profile.linkedin_url || ''}
                                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                                className="admin-input"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">WhatsApp</label>
                            <input
                                type="tel"
                                value={profile.twitter_url || ''}
                                onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                                className="admin-input"
                                placeholder="+212 6XX XXX XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Website</label>
                            <input
                                type="url"
                                value={profile.website_url || ''}
                                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                                className="admin-input"
                                placeholder="https://yoursite.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="admin-card space-y-4">
                    <h3 className="text-sm font-body font-medium text-text-primary mb-2">Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Years Experience</label>
                            <input
                                type="number"
                                min={0}
                                value={profile.years_experience ?? 0}
                                onChange={(e) => setProfile({ ...profile, years_experience: parseInt(e.target.value) || 0 })}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Projects Count</label>
                            <input
                                type="number"
                                min={0}
                                value={profile.projects_count ?? 0}
                                onChange={(e) => setProfile({ ...profile, projects_count: parseInt(e.target.value) || 0 })}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Clients Count</label>
                            <input
                                type="number"
                                min={0}
                                value={profile.clients_count ?? 0}
                                onChange={(e) => setProfile({ ...profile, clients_count: parseInt(e.target.value) || 0 })}
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* CV Upload */}
                <div className="admin-card">
                    <h3 className="text-sm font-body font-medium text-text-primary mb-4">CV / Resume</h3>
                    <div className="flex items-center gap-4">
                        {profile.cv_url && (
                            <a
                                href={profile.cv_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-accent hover:underline"
                            >
                                Current CV
                            </a>
                        )}
                        <label className="admin-btn admin-btn-secondary cursor-pointer">
                            <Upload size={14} />
                            Upload CV
                            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleImageUpload(e, 'cv')} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
