import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        browser: {
            enabled: true,
            name: 'chromium',
            provider: 'playwright',
        },
    },
});
