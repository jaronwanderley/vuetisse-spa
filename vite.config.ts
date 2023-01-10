import path from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import pwaConfig from './pwa.config'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',

  build: {
    outDir: './docs',
  },

  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    vue({
      reactivityTransform: true,
    }),

    Unocss(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue/macros',
        '@vueuse/core',
        {
          animol: [
            ['css', 'animate'],
            'ease',
            ['Easing', 'easing'],
            'parseColor',
            'blend',
          ],
          redaxios: [
            ['default', 'axios'],
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),

    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    VitePWA(pwaConfig as Partial<VitePWAOptions>),

    Pages({
      extensions: ['vue'],
    }),

    Layouts(),
  ],

  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
})
