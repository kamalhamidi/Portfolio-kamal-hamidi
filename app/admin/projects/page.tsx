'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/admin/TopBar';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { createClient } from '@/lib/supabase/client';
import { createProject, updateProject, deleteProject, uploadFile } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, Plus, Star, Upload, X } from 'lucide-react';
import type { Project } from '@/types';

const emptyProject: Omit<Project, 'id' | 'created_at'> = {
    name: '',
    description: '',
    long_description: '',
    tags: [],
    image_url: null,
    github_url: null,
    live_url: null,
    featured: false,
    sort_order: 0,
};

export default function ProjectsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState(emptyProject);
    const [saving, setSaving] = useState(false);
    const [newTag, setNewTag] = useState('');

    const fetchProjects = useCallback(async () => {
        const { data } = await supabase.from('projects').select('*').order('sort_order');
        setProjects((data ?? []) as Project[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyProject);
        setModalOpen(true);
    };

    const openEdit = (project: Project) => {
        setEditing(project);
        setForm({
            name: project.name,
            description: project.description,
            long_description: project.long_description,
            tags: project.tags || [],
            image_url: project.image_url,
            github_url: project.github_url,
            live_url: project.live_url,
            featured: project.featured,
            sort_order: project.sort_order,
        });
        setModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'avatars');
        formData.append('path', 'projects');

        const result = await uploadFile(formData);
        if (result.success && result.url) {
            setForm({ ...form, image_url: result.url });
            toast.success('Image uploaded!');
        } else {
            toast.error(result.error || 'Upload failed');
        }
    };

    const addTag = () => {
        if (!newTag.trim()) return;
        setForm({ ...form, tags: [...form.tags, newTag.trim()] });
        setNewTag('');
    };

    const removeTag = (index: number) => {
        setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        setSaving(true);
        const result = editing
            ? await updateProject(editing.id, form)
            : await createProject(form);

        if (result.success) {
            toast.success(editing ? 'Project updated!' : 'Project created!');
            setModalOpen(false);
            fetchProjects();
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to save');
        }
        setSaving(false);
    };

    const handleDelete = async (project: Project) => {
        if (!confirm(`Delete "${project.name}"?`)) return;
        const result = await deleteProject(project.id);
        if (result.success) {
            toast.success('Project deleted');
            setProjects(projects.filter((p) => p.id !== project.id));
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to delete');
        }
    };

    const columns: Column<Project>[] = [
        {
            key: 'name',
            label: 'Name',
            render: (p) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated overflow-hidden shrink-0">
                        {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-accent/30 font-display">
                                {p.name[0]}
                            </div>
                        )}
                    </div>
                    <span className="font-medium">{p.name}</span>
                </div>
            ),
        },
        {
            key: 'tags',
            label: 'Tags',
            render: (p) => (
                <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-accent/10 text-accent/70 font-mono">
                            {tag}
                        </span>
                    ))}
                    {(p.tags || []).length > 3 && (
                        <span className="text-[10px] text-text-secondary">+{p.tags.length - 3}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'featured',
            label: 'Featured',
            render: (p) => p.featured ? <Star size={14} className="text-accent fill-accent" /> : null,
        },
    ];

    return (
        <>
            <TopBar
                title="Projects"
                breadcrumb="Admin / Projects"
                action={
                    <button onClick={openCreate} className="admin-btn admin-btn-primary">
                        <Plus size={14} />
                        Add Project
                    </button>
                }
            />

            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-accent" size={24} />
                    </div>
                ) : (
                    <div className="admin-card">
                        <DataTable columns={columns} data={projects} onEdit={openEdit} onDelete={handleDelete} />
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <FormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Project' : 'New Project'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="admin-input"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="admin-input resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Long Description</label>
                        <textarea
                            rows={5}
                            value={form.long_description || ''}
                            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                            className="admin-input resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Tags</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {form.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">
                                    {tag}
                                    <button onClick={() => removeTag(i)}><X size={10} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="admin-input flex-1"
                                placeholder="Add tag..."
                            />
                            <button onClick={addTag} className="admin-btn admin-btn-secondary"><Plus size={14} /></button>
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Image</label>
                        {form.image_url && (
                            <div className="w-full h-32 rounded-lg overflow-hidden mb-2 bg-bg-elevated">
                                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="admin-btn admin-btn-secondary cursor-pointer">
                            <Upload size={14} />
                            Upload Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>

                    {/* URLs */}
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">GitHub URL</label>
                        <input
                            type="url"
                            value={form.github_url || ''}
                            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Live URL</label>
                        <input
                            type="url"
                            value={form.live_url || ''}
                            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                            className="admin-input"
                        />
                    </div>

                    {/* Featured + Sort */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                className="w-4 h-4 accent-[var(--accent)]"
                            />
                            Featured
                        </label>
                        <div className="flex-1">
                            <label className="block text-xs text-text-secondary mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                className="admin-input w-20"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary flex-1">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                        <button onClick={() => setModalOpen(false)} className="admin-btn admin-btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </FormModal>
        </>
    );
}
