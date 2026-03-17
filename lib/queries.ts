import { createClient } from '@/lib/supabase/server';
import type { Profile, Project, Experience, Certification, Skill } from '@/types';

export async function getProfile(): Promise<Profile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
    }

    return data as Profile;
}

export async function getProjects(): Promise<Project[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error.message);
        return [];
    }

    return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching project:', error.message);
        return null;
    }

    return data as Project;
}

export async function getExperience(): Promise<Experience[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching experience:', error.message);
        return [];
    }

    return (data ?? []) as Experience[];
}

export async function getCertifications(): Promise<Certification[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching certifications:', error.message);
        return [];
    }

    return (data ?? []) as Certification[];
}

export async function getSkills(): Promise<Skill[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching skills:', error.message);
        return [];
    }

    return (data ?? []) as Skill[];
}

export async function getDashboardStats() {
    const supabase = createClient();

    const [projects, experience, certifications, skills] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('experience').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
    ]);

    return {
        projectsCount: projects.count ?? 0,
        experienceCount: experience.count ?? 0,
        certificationsCount: certifications.count ?? 0,
        skillsCount: skills.count ?? 0,
    };
}
