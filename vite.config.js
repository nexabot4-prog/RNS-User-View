import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('motion') || id.includes('framer-motion')) {
                            return 'motion-vendor';
                        }
                        if (id.includes('lucide-react')) {
                            return 'lucide-vendor';
                        }
                        if (id.includes('@supabase')) {
                            return 'supabase-vendor';
                        }
                        return 'vendor'; // Fallback for other node_modules
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Increase limit to avoid warnings for large chunks like vendor
    },
})
