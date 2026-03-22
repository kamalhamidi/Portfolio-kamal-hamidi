import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cormorant',
    display: 'swap',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    variable: '--font-dm-sans',
    display: 'swap',
});

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-jetbrains',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Kamal HAMIDI - Data Scientist and IA Engineer',
    description:
        'A passionate full-stack developer crafting digital experiences at the intersection of design and engineering.',
    openGraph: {
        title: 'Kamal HAMIDI - Data Scientist and IA Engineer',
        description:
            'A passionate full-stack developer crafting digital experiences at the intersection of design and engineering.',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}
        >
            <body className="noise-overlay custom-cursor">
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#16162a',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: '#f0f0f5',
                        },
                    }}
                />
                <CursorFollower />
            </body>
        </html>
    );
}

function CursorFollower() {
    return (
        <>
            <div id="cursor-dot" className="cursor-dot" />
            <div id="cursor-ring" className="cursor-ring" />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              if (window.matchMedia('(pointer: fine)').matches) {
                var dot = document.getElementById('cursor-dot');
                var ring = document.getElementById('cursor-ring');
                if (!dot || !ring) return;
                var mx = 0, my = 0, rx = 0, ry = 0;
                document.addEventListener('mousemove', function(e) {
                  mx = e.clientX; my = e.clientY;
                  dot.style.left = mx + 'px';
                  dot.style.top = my + 'px';
                });
                function animate() {
                  rx += (mx - rx) * 0.15;
                  ry += (my - ry) * 0.15;
                  ring.style.left = rx + 'px';
                  ring.style.top = ry + 'px';
                  requestAnimationFrame(animate);
                }
                animate();
                document.addEventListener('mouseenter', function(e) {
                  if (e.target && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest && e.target.closest('a,button'))) {
                    ring.classList.add('hovering');
                  }
                }, true);
                document.addEventListener('mouseleave', function(e) {
                  if (e.target && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest && e.target.closest('a,button'))) {
                    ring.classList.remove('hovering');
                  }
                }, true);
              }
            })();
          `,
                }}
            />
        </>
    );
}
