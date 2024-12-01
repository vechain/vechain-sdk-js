import { defineConfig, ViteUserConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()] as ViteUserConfig["plugins"],
  test: {
    environment: 'jsdom',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
    include: ['tests/*.spec.tsx'],
    exclude: ['e2e/*.spec.ts'],
  }
})