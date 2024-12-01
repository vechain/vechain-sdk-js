import { defineConfig, ViteUserConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()] as ViteUserConfig["plugins"],
  define: {
    'process.env': JSON.stringify({})
  },
  test: {
    environment: 'jsdom',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
    exclude: ['chromium-bidi', 'chromium-bidi/lib/cjs/cdp/CdpConnection', 'chromium-bidi/lib/cjs/bidiMapper/BidiMapper'],
  },
})