// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr:false,
  modules: ['nuxt-workers', '@nuxtjs/tailwindcss'],
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