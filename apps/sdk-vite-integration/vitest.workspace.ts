import { defineWorkspace, ViteUserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineWorkspace([
    'packages/*',
    {
        plugins: [react()] as ViteUserConfig["plugins"],
        test: {
            browser: {
                enabled: true,
                name: 'chromium',
                provider: 'playwright'
            },
            name: 'node-env',
            environment: 'node',
            include: ['tests/*.spec.tsx'],
            exclude: ['e2e/*.spec.ts'],
        },
    },
    {
        plugins: [react()] as ViteUserConfig["plugins"],
        test: {
            browser: {
                enabled: true,
                name: 'chromium',
                provider: 'playwright',
            },
            name: 'jsdom-env',
            environment: 'jsdom',
            include: ['tests/*.spec.tsx'],
            exclude: ['e2e/*.spec.ts'],
        },
    }
])