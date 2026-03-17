import { redirect } from 'next/navigation';
import { getProject } from '@/lib/queries';

export default async function ProjectEditPage({
    params,
}: {
    params: { id: string };
}) {
    const project = await getProject(params.id);

    if (!project) {
        redirect('/admin/projects');
    }

    // Redirect to projects list — editing happens via slide-over on list page
    redirect('/admin/projects');
}
