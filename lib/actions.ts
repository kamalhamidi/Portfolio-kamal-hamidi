'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════════════════

const profileSchema = z.object({
    full_name: z.string().min(1, 'Name is required'),
    roles: z.array(z.string()),
    location: z.string().nullable(),
    availability: z.boolean(),
    bio: z.string().nullable(),
    email: z.string().email('Invalid email').nullable(),
    github_url: z.union([z.string().url(), z.literal(''), z.null()]),
    linkedin_url: z.union([z.string().url(), z.literal(''), z.null()]),
    twitter_url: z.union([z.string().url(), z.literal(''), z.null()]),
    website_url: z.union([z.string().url(), z.literal(''), z.null()]),
    photo_url: z.string().nullable(),
    cv_url: z.string().nullable(),
    years_experience: z.number().int().min(0).nullable(),
    projects_count: z.number().int().min(0).nullable(),
    clients_count: z.number().int().min(0).nullable(),
    accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color'),
});

const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().nullable(),
    long_description: z.string().nullable(),
    tags: z.array(z.string()),
    image_url: z.string().nullable(),
    github_url: z.union([z.string().url(), z.literal(''), z.null()]),
    live_url: z.union([z.string().url(), z.literal(''), z.null()]),
    featured: z.boolean(),
    sort_order: z.number().int(),
});

const experienceSchema = z.object({
    type: z.enum(['experience', 'formation']),
    title: z.string().min(1, 'Title is required'),
    organization: z.string().nullable(),
    location: z.string().nullable(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    is_current: z.boolean(),
    description: z.string().nullable(),
    tags: z.array(z.string()),
    sort_order: z.number().int(),
});

const certificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().nullable(),
    issue_date: z.string().nullable(),
    expiry_date: z.string().nullable(),
    credential_id: z.string().nullable(),
    verify_url: z.union([z.string().url(), z.literal(''), z.null()]),
    image_url: z.string().nullable(),
    sort_order: z.number().int(),
});

const skillSchema = z.object({
    name: z.string().min(1, 'Skill name is required'),
    category: z.enum(['skill', 'tech']),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    sort_order: z.number().int(),
});

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

function cleanUrls<T extends Record<string, unknown>>(data: T): T {
    const cleaned = { ...data };
    for (const key of Object.keys(cleaned)) {
        if (key.endsWith('_url') && cleaned[key] === '') {
            (cleaned as Record<string, unknown>)[key] = null;
        }
    }
    return cleaned;
}

type ActionResult = {
    success: boolean;
    error?: string;
    data?: Record<string, unknown>;
};

// ═══════════════════════════════════════════════════
// PROFILE ACTIONS
// ═══════════════════════════════════════════════════

export async function updateProfile(
    id: string,
    formData: z.infer<typeof profileSchema>
): Promise<ActionResult> {
    try {
        const validated = profileSchema.parse(formData);
        const cleaned = cleanUrls(validated);
        const supabase = createClient();

        const { error } = await supabase
            .from('profiles')
            .update({ ...cleaned, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/profile');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        return { success: false, error: message };
    }
}

export async function updateAccentColor(
    id: string,
    color: string
): Promise<ActionResult> {
    try {
        const validated = z.string().regex(/^#[0-9a-fA-F]{6}$/).parse(color);
        const supabase = createClient();

        const { error } = await supabase
            .from('profiles')
            .update({ accent_color: validated, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update color';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// FILE UPLOAD
// ═══════════════════════════════════════════════════

export async function uploadFile(
    formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string;
        const path = formData.get('path') as string;

        if (!file || !bucket || !path) {
            return { success: false, error: 'Missing file, bucket, or path' };
        }

        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const filePath = `${path}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { success: true, url: urlData.publicUrl };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// PROJECT ACTIONS
// ═══════════════════════════════════════════════════

export async function createProject(
    formData: z.infer<typeof projectSchema>
): Promise<ActionResult> {
    try {
        const validated = projectSchema.parse(formData);
        const cleaned = cleanUrls(validated);
        const supabase = createClient();

        const { data, error } = await supabase
            .from('projects')
            .insert(cleaned)
            .select()
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/projects');
        return { success: true, data: data as Record<string, unknown> };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        return { success: false, error: message };
    }
}

export async function updateProject(
    id: string,
    formData: z.infer<typeof projectSchema>
): Promise<ActionResult> {
    try {
        const validated = projectSchema.parse(formData);
        const cleaned = cleanUrls(validated);
        const supabase = createClient();

        const { error } = await supabase
            .from('projects')
            .update(cleaned)
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update project';
        return { success: false, error: message };
    }
}

export async function deleteProject(id: string): Promise<ActionResult> {
    try {
        const supabase = createClient();
        const { error } = await supabase.from('projects').delete().eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete project';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// EXPERIENCE ACTIONS
// ═══════════════════════════════════════════════════

export async function createExperience(
    formData: z.infer<typeof experienceSchema>
): Promise<ActionResult> {
    try {
        const validated = experienceSchema.parse(formData);
        const supabase = createClient();

        const { data, error } = await supabase
            .from('experience')
            .insert(validated)
            .select()
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/experience');
        return { success: true, data: data as Record<string, unknown> };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create experience';
        return { success: false, error: message };
    }
}

export async function updateExperience(
    id: string,
    formData: z.infer<typeof experienceSchema>
): Promise<ActionResult> {
    try {
        const validated = experienceSchema.parse(formData);
        const supabase = createClient();

        const { error } = await supabase
            .from('experience')
            .update(validated)
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/experience');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update experience';
        return { success: false, error: message };
    }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
    try {
        const supabase = createClient();
        const { error } = await supabase.from('experience').delete().eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/experience');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete experience';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// CERTIFICATION ACTIONS
// ═══════════════════════════════════════════════════

export async function createCertification(
    formData: z.infer<typeof certificationSchema>
): Promise<ActionResult> {
    try {
        const validated = certificationSchema.parse(formData);
        const cleaned = cleanUrls(validated);
        const supabase = createClient();

        const { data, error } = await supabase
            .from('certifications')
            .insert(cleaned)
            .select()
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/certifications');
        return { success: true, data: data as Record<string, unknown> };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create certification';
        return { success: false, error: message };
    }
}

export async function updateCertification(
    id: string,
    formData: z.infer<typeof certificationSchema>
): Promise<ActionResult> {
    try {
        const validated = certificationSchema.parse(formData);
        const cleaned = cleanUrls(validated);
        const supabase = createClient();

        const { error } = await supabase
            .from('certifications')
            .update(cleaned)
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/certifications');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update certification';
        return { success: false, error: message };
    }
}

export async function deleteCertification(id: string): Promise<ActionResult> {
    try {
        const supabase = createClient();
        const { error } = await supabase.from('certifications').delete().eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/certifications');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete certification';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// SKILL ACTIONS
// ═══════════════════════════════════════════════════

export async function createSkill(
    formData: z.infer<typeof skillSchema>
): Promise<ActionResult> {
    try {
        const validated = skillSchema.parse(formData);
        const supabase = createClient();

        const { data, error } = await supabase
            .from('skills')
            .insert(validated)
            .select()
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/skills');
        return { success: true, data: data as Record<string, unknown> };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create skill';
        return { success: false, error: message };
    }
}

export async function updateSkill(
    id: string,
    formData: z.infer<typeof skillSchema>
): Promise<ActionResult> {
    try {
        const validated = skillSchema.parse(formData);
        const supabase = createClient();

        const { error } = await supabase.from('skills').update(validated).eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/skills');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update skill';
        return { success: false, error: message };
    }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
    try {
        const supabase = createClient();
        const { error } = await supabase.from('skills').delete().eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/');
        revalidatePath('/admin/skills');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete skill';
        return { success: false, error: message };
    }
}

// ═══════════════════════════════════════════════════
// REVALIDATION
// ═══════════════════════════════════════════════════

export async function revalidatePortfolio(): Promise<ActionResult> {
    try {
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Revalidation failed';
        return { success: false, error: message };
    }
}
