/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The mock 500-user dataset (src/mocks/users.json) is lazy-loaded into its
    // own chunk (see services/userApi.ts) so it never bloats the initial Login
    // bundle. That chunk is still ~550KB of JSON, which is expected and fine —
    // raising the warning limit here just silences the noise for a dataset size
    // we already made a deliberate call about, rather than something to actually
    // optimize further for this assessment.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
