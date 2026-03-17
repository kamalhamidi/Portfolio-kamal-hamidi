'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/admin/TopBar';
import { createClient } from '@/lib/supabase/client';
import { createSkill, updateSkill, deleteSkill } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Pencil, Layers, Cpu, X } from 'lucide-react';
import type { Skill } from '@/types';

const levelColors: Record<string, string> = {
    Expert: 'bg-green-500/20 text-green-400 border-green-500/30',
    Advanced: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Beginner: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function SkillsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', level: 'Intermediate' as Skill['level'], sort_order: 0 });
    const [saving, setSaving] = useState(false);
    const [addingTo, setAddingTo] = useState<'skill' | 'tech' | null>(null);

    const fetchData = useCallback(async () => {
        const { data } = await supabase.from('skills').select('*').order('category').order('sort_order');
        setSkills((data ?? []) as Skill[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const skillItems = skills.filter((s) => s.category === 'skill');
    const techItems = skills.filter((s) => s.category === 'tech');

    const startAdd = (category: 'skill' | 'tech') => {
        setEditingId(null);
        setForm({ name: '', level: 'Intermediate', sort_order: 0 });
        setAddingTo(category);
    };

    const startEdit = (skill: Skill) => {
        setAddingTo(null);
        setEditingId(skill.id);
        setForm({ name: skill.name, level: skill.level, sort_order: skill.sort_order });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setAddingTo(null);
    };

    const handleSave = async (category: 'skill' | 'tech') => {
        if (!form.name.trim()) return;
        setSaving(true);

        const result = editingId
            ? await updateSkill(editingId, { ...form, category })
            : await createSkill({ ...form, category });

        if (result.success) {
            toast.success(editingId ? 'Updated!' : 'Added!');
            cancelEdit();
            fetchData();
            router.refresh();
        } else {
            toast.error(result.error || 'Failed');
        }
        setSaving(false);
    };

    const handleDelete = async (skill: Skill) => {
        if (!confirm(`Delete "${skill.name}"?`)) return;
        const result = await deleteSkill(skill.id);
        if (result.success) {
            toast.success('Deleted');
            setSkills(skills.filter((s) => s.id !== skill.id));
            router.refresh();
        } else {
            toast.error(result.error || 'Failed');
        }
    };

    const renderList = (items: Skill[], category: 'skill' | 'tech') => (
        <div className="space-y-2">
            {items.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
                    {editingId === skill.id ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="admin-input flex-1"
                                autoFocus
                            />
                            <select
                                value={form.level}
                                onChange={(e) => setForm({ ...form, level: e.target.value as Skill['level'] })}
                                className="admin-input w-32"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>Expert</option>
                            </select>
                            <button onClick={() => handleSave(category)} disabled={saving} className="admin-btn admin-btn-primary text-xs px-3 py-1.5">
                                {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                            </button>
                            <button onClick={cancelEdit} className="admin-btn admin-btn-secondary text-xs px-3 py-1.5">
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-sm text-text-primary">{skill.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[10px] rounded border ${levelColors[skill.level]}`}>
                                    {skill.level}
                                </span>
                                <button onClick={() => startEdit(skill)} className="p-1 rounded hover:bg-accent/10 text-text-secondary hover:text-accent transition-colors">
                                    <Pencil size={12} />
                                </button>
                                <button onClick={() => handleDelete(skill)} className="p-1 rounded hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Add form */}
            {addingTo === category && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-accent/20 bg-accent/5">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="admin-input flex-1"
                        placeholder="Skill name..."
                        autoFocus
                    />
                    <select
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value as Skill['level'] })}
                        className="admin-input w-32"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                    </select>
                    <button onClick={() => handleSave(category)} disabled={saving} className="admin-btn admin-btn-primary text-xs px-3 py-1.5">
                        {saving ? <Loader2 size={12} className="animate-spin" /> : 'Add'}
                    </button>
                    <button onClick={cancelEdit} className="admin-btn admin-btn-secondary text-xs px-3 py-1.5">
                        <X size={12} />
                    </button>
                </div>
            )}

            {addingTo !== category && (
                <button onClick={() => startAdd(category)} className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border text-sm text-text-secondary hover:text-accent hover:border-accent/30 transition-colors">
                    <Plus size={14} />
                    Add {category === 'skill' ? 'Skill' : 'Technology'}
                </button>
            )}
        </div>
    );

    if (loading) {
        return (
            <>
                <TopBar title="Skills" breadcrumb="Admin / Skills" />
                <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={24} /></div>
            </>
        );
    }

    return (
        <>
            <TopBar title="Skills" breadcrumb="Admin / Skills" />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div className="admin-card">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={18} className="text-accent" />
                            <h3 className="text-sm font-body font-medium text-text-primary">Skills</h3>
                            <span className="text-xs text-text-secondary ml-auto">{skillItems.length} items</span>
                        </div>
                        {renderList(skillItems, 'skill')}
                    </div>

                    {/* Tech Stack */}
                    <div className="admin-card">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu size={18} className="text-accent" />
                            <h3 className="text-sm font-body font-medium text-text-primary">Tech Stack</h3>
                            <span className="text-xs text-text-secondary ml-auto">{techItems.length} items</span>
                        </div>
                        {renderList(techItems, 'tech')}
                    </div>
                </div>
            </div>
        </>
    );
}
