import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { execSync } from 'node:child_process'
import path from 'path'
import packageJson from './package.json'

/**
 * Resolves the current commit for build labeling.
 * CI can override this with `VITE_GIT_SHA`; local builds fall back to git or `dev`.
 */
const getGitSha = () => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'dev'
  }
}

const appVersion = packageJson.version
const gitSha = process.env.VITE_GIT_SHA ?? getGitSha()

export default defineConfig({
  base: '/hynes-portfolio-static/',
  build: {
    manifest: true,
  },
  define: {
    // Expose release metadata as compile-time constants for lightweight UI display.
    __APP_GIT_SHA__: JSON.stringify(gitSha),
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Add global SCSS imports here if needed
      },
    },
  },
  plugins: [react(), viteCommonjs()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/stories/**', 'src/components/archived/**', 'src/main.tsx'],
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: 'coverage/report',
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      }
    },
  },
})
