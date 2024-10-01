// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['nuxt-workers'],
  plugins: [
    '~/plugins/transformers.client.ts'
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@xenova/transformers']
    }
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  // or sourcemap: true
  sourcemap: {
    server: true,
    client: true
  }
})