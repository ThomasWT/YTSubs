// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr:false,
  modules: ['nuxt-workers', '@nuxtjs/tailwindcss'],
  // or sourcemap: true
  sourcemap: {
    server: true,
    client: true
  }
})