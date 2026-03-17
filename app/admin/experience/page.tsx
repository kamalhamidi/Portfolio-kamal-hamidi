'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/admin/TopBar';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { createClient } from '@/lib/supabase/client';
import { createExperience, updateExperience, deleteExperience } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, Plus, Briefcase, GraduationCap, X } from 'lucide-react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';

type TabType = 'experience' | 'formation';

const emptyForm: {
    type: 'experience' | 'formation';
    title: string;
    organization: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string;
    tags: string[];
    sort_order: number;
} = {
    type: 'experience',
    title: '',
    organization: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    tags: [],
    sort_order: 0,
};

export default function ExperiencePage() {
    const router = useRouter();
    const supabase = createClient();
    const [items, setItems] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabType>('experience');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Experience | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [newTag, setNewTag] = useState('');

    const fetchData = useCallback(async () => {
        const { data } = await supabase.from('experience').select('*').order('start_date', { ascending: false });
        setItems((data ?? []) as Experience[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = items.filter((i) => i.type === tab);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm, type: tab });
        setModalOpen(true);
    };

    const openEdit = (item: Experience) => {
        setEditing(item);
        setForm({
            type: item.type,
            title: item.title,
            organization: item.organization || '',
            location: item.location || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            is_current: item.is_current,
            description: item.description || '',
            tags: item.tags || [],
            sort_order: item.sort_order,
        });
        setModalOpen(true);
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
        const payload = {
            ...form,
            organization: form.organization || null,
            location: form.location || null,
            start_date: form.start_date || null,
            end_date: form.is_current ? null : form.end_date || null,
            description: form.description || null,
        };
        const result = editing
            ? await updateExperience(editing.id, payload)
            : await createExperience(payload);

        if (result.success) {
            toast.success(editing ? 'Updated!' : 'Created!');
            setModalOpen(false);
            fetchData();
            router.refresh();
        } else {
            toast.error(result.error || 'Failed');
        }
        setSaving(false);
    };

    const handleDelete = async (item: Experience) => {
        if (!confirm(`Delete "${item.title}"?`)) return;
        const result = await deleteExperience(item.id);
        if (result.success) {
            toast.success('Deleted');
            setItems(items.filter((i) => i.id !== item.id));
            router.refresh();
        } else {
            toast.error(result.error || 'Failed');
        }
    };

    const columns: Column<Experience>[] = [
        {
            key: 'title',
            label: 'Title',
            render: (e) => (
                <div className="flex items-center gap-2">
                    {e.type === 'experience' ? <Briefcase size={14} className="text-accent shrink-0" /> : <GraduationCap size={14} className="text-accent shrink-0" />}
                    <span className="font-medium">{e.title}</span>
                </div>
            ),
        },
        { key: 'organization', label: 'Organization' },
        {
            key: 'start_date',
            label: 'Period',
            render: (e) => <span className="text-xs text-text-secondary">{formatDateRange(e.start_date, e.end_date, e.is_current)}</span>,
        },
    ];

    return (
        <>
            <TopBar
                title="Experience"
                breadcrumb="Admin / Experience"
                action={
                    <button onClick={openCreate} className="admin-btn admin-btn-primary">
                        <Plus size={14} />
                        Add {tab === 'experience' ? 'Experience' : 'Education'}
                    </button>
                }
            />

            <div className="p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['experience', 'formation'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === t ? 'bg-accent/10 text-accent border border-accent/30' : 'text-text-secondary hover:bg-bg-elevated'
                                }`}
                        >
                            {t === 'experience' ? 'Work Experience' : 'Education & Formations'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-accent" size={24} />
                    </div>
                ) : (
                    <div className="admin-card">
                        <DataTable columns={columns} data={filtered} onEdit={openEdit} onDelete={handleDelete} />
                    </div>
                )}
            </div>

            <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Entry' : 'New Entry'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Title *</label>
                        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Organization</label>
                            <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="admin-input" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Location</label>
                            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Start Date</label>
                            <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="admin-input" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">End Date</label>
                            <input type="date" value={form.end_date} disabled={form.is_current} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="admin-input disabled:opacity-50" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
                        Currently here
                    </label>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Description</label>
                        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Tags</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {form.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">
                                    {tag}<button onClick={() => removeTag(i)}><X size={10} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="admin-input flex-1" placeholder="Add tag..." />
                            <button onClick={addTag} className="admin-btn admin-btn-secondary"><Plus size={14} /></button>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary flex-1">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                        <button onClick={() => setModalOpen(false)} className="admin-btn admin-btn-secondary">Cancel</button>
                    </div>
                </div>
            </FormModal>
        </>
    );
}
