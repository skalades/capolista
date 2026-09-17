import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('apexcharts') || id.includes('react-apexcharts')) {
                            return 'vendor-charts';
                        }
                        if (id.includes('@heroicons') || id.includes('lucide-react') || id.includes('react-icons')) {
                            return 'vendor-icons';
                        }
                        if (id.includes('react') || id.includes('react-dom') || id.includes('@inertiajs') || id.includes('@headlessui')) {
                            return 'vendor-core';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
