import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // Next.js build/config artifacts — no logic to test
        'next.config.js',
        'eslint.config.mjs',
        'next-env.d.ts',
        // RootLayout exists to register fonts/metadata — covered via integration in pages
        'src/app/layout.tsx',
        // Next.js build output
        '.next/**',
        // Ambient type declarations
        '**/*.d.ts',
        // Tool configs (commitlint, etc.)
        '**/*.config.*',
        'commitlint.config.*',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 95,
      },
    },
  },
})
