export interface Profile {
    id: string;
    full_name: string | null;
    roles: string[];
    location: string | null;
    availability: boolean;
    bio: string | null;
    email: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    website_url: string | null;
    photo_url: string | null;
    cv_url: string | null;
    years_experience: number | null;
    projects_count: number | null;
    clients_count: number | null;
    accent_color: string;
    updated_at: string;
}

export interface Project {
    id: string;
    name: string;
    description: string | null;
    long_description: string | null;
    tags: string[];
    image_url: string | null;
    github_url: string | null;
    live_url: string | null;
    featured: boolean;
    sort_order: number;
    created_at: string;
}

export interface Experience {
    id: string;
    type: 'experience' | 'formation';
    title: string;
    organization: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    tags: string[];
    sort_order: number;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string | null;
    issue_date: string | null;
    expiry_date: string | null;
    credential_id: string | null;
    verify_url: string | null;
    image_url: string | null;
    sort_order: number;
}

export interface Skill {
    id: string;
    name: string;
    category: 'skill' | 'tech';
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    sort_order: number;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface DashboardStats {
    projectsCount: number;
    experienceCount: number;
    certificationsCount: number;
    skillsCount: number;
}
