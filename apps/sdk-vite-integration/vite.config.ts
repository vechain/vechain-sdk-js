import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chromium-bidi', 'chromium-bidi/lib/cjs/cdp/CdpConnection', 'chromium-bidi/lib/cjs/bidiMapper/BidiMapper']
  },
})
