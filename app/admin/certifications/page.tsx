'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/admin/TopBar';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { createClient } from '@/lib/supabase/client';
import { createCertification, updateCertification, deleteCertification, uploadFile } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, Plus, Upload } from 'lucide-react';
import type { Certification } from '@/types';
import { formatDate } from '@/lib/utils';

const emptyForm = {
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    verify_url: '',
    image_url: null as string | null,
    sort_order: 0,
};

export default function CertificationsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [items, setItems] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Certification | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        const { data } = await supabase.from('certifications').select('*').order('sort_order');
        setItems((data ?? []) as Certification[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (cert: Certification) => {
        setEditing(cert);
        setForm({
            name: cert.name,
            issuer: cert.issuer || '',
            issue_date: cert.issue_date || '',
            expiry_date: cert.expiry_date || '',
            credential_id: cert.credential_id || '',
            verify_url: cert.verify_url || '',
            image_url: cert.image_url,
            sort_order: cert.sort_order,
        });
        setModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('bucket', 'avatars');
        fd.append('path', 'certifications');
        const result = await uploadFile(fd);
        if (result.success && result.url) {
            setForm({ ...form, image_url: result.url });
            toast.success('Image uploaded!');
        } else {
            toast.error(result.error || 'Upload failed');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            ...form,
            issuer: form.issuer || null,
            issue_date: form.issue_date || null,
            expiry_date: form.expiry_date || null,
            credential_id: form.credential_id || null,
            verify_url: form.verify_url || '',
        };
        const result = editing
            ? await updateCertification(editing.id, payload)
            : await createCertification(payload);

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

    const handleDelete = async (cert: Certification) => {
        if (!confirm(`Delete "${cert.name}"?`)) return;
        const result = await deleteCertification(cert.id);
        if (result.success) {
            toast.success('Deleted');
            setItems(items.filter((i) => i.id !== cert.id));
            router.refresh();
        } else {
            toast.error(result.error || 'Failed');
        }
    };

    const columns: Column<Certification>[] = [
        { key: 'name', label: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
        { key: 'issuer', label: 'Issuer' },
        { key: 'issue_date', label: 'Issued', render: (c) => <span className="text-xs text-text-secondary">{formatDate(c.issue_date)}</span> },
    ];

    return (
        <>
            <TopBar
                title="Certifications"
                breadcrumb="Admin / Certifications"
                action={
                    <button onClick={openCreate} className="admin-btn admin-btn-primary">
                        <Plus size={14} />
                        Add Certification
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
                        <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} />
                    </div>
                )}
            </div>

            <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certification' : 'New Certification'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Name *</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Issuer</label>
                        <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="admin-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Issue Date</label>
                            <input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className="admin-input" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Expiry Date</label>
                            <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="admin-input" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Credential ID</label>
                        <input type="text" value={form.credential_id} onChange={(e) => setForm({ ...form, credential_id: e.target.value })} className="admin-input" />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Verify URL</label>
                        <input type="url" value={form.verify_url} onChange={(e) => setForm({ ...form, verify_url: e.target.value })} className="admin-input" />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Image</label>
                        {form.image_url && (
                            <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-bg-elevated">
                                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="admin-btn admin-btn-secondary cursor-pointer">
                            <Upload size={14} />Upload Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Sort Order</label>
                        <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="admin-input w-20" />
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
