import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { nitro } from 'nitro/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@heroui-pro/react': path.resolve(__dirname, './src/lib/heroui-pro-mock.tsx'),
    },
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: true
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        concurrency: 4,
        filter: (page) => !page.path.startsWith('/demo'),
      },
    }),
    viteReact()
  ],
})

export default config
