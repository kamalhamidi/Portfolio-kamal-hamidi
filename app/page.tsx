import Navbar from '@/components/portfolio/Navbar';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import CertificationsSection from '@/components/portfolio/CertificationsSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import {
    getProfile,
    getProjects,
    getExperience,
    getCertifications,
    getSkills,
} from '@/lib/queries';

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
    const [profile, projects, experience, certifications, skills] = await Promise.all([
        getProfile(),
        getProjects(),
        getExperience(),
        getCertifications(),
        getSkills(),
    ]);

    return (
        <main>
            <Navbar profile={profile} />
            <HeroSection profile={profile} />
            <AboutSection profile={profile} skills={skills} />
            <ExperienceSection experience={experience} />
            <ProjectsSection projects={projects} />
            <CertificationsSection certifications={certifications} />
            <SkillsSection skills={skills} />
            <ContactSection profile={profile} />
            <Footer profile={profile} />
        </main>
    );
}
