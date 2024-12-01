import '@/bootstrap';
import '@/../css/app.css';
import '@/../css/assets.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'

const appName = import.meta.env.VITE_APP_NAME || 'Ubinan Kediri';
// Start:NProgress
let timeout: NodeJS.Timeout | null = null;

router.on('start', () => {
    timeout = setTimeout(() => NProgress.start(), 250); // Mulai NProgress setelah 250ms
  });

// Event listener untuk memperbarui progress
router.on('progress', (event) => {
    if (NProgress.isStarted() && event.detail.progress?.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9); // Set progress hingga 90%
    }
});

// Event listener untuk menyelesaikan progress
router.on('finish', (event) => {
    if (timeout) clearTimeout(timeout); // Bersihkan timeout

    if (!NProgress.isStarted()) return; // Jika NProgress tidak berjalan, hentikan eksekusi

    if (event.detail.visit.completed) {
    NProgress.done(); // Selesaikan NProgress jika kunjungan selesai
    } else if (event.detail.visit.interrupted) {
    NProgress.set(0); // Reset progress jika kunjungan terputus
    } else if (event.detail.visit.cancelled) {
    NProgress.done(); // Selesaikan dan hapus NProgress jika kunjungan dibatalkan
    NProgress.remove();
    }
});
// End:NProgress

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    // progress: {
    //     // color: '#4B5563',
    //     color: 'var(--blue-bps-medium)',
    // },
    progress: false,
});
