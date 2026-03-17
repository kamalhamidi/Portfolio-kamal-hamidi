import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If no user (login page), render without sidebar
    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-bg-primary">
            <Sidebar userName={user.email} />
            <div className="flex-1 ml-60">{children}</div>
        </div>
    );
}
