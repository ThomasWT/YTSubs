// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['nuxt-workers', '@nuxtjs/tailwindcss', '@vueuse/motion/nuxt', '@nuxt/fonts'],
  runtimeConfig: {
    domain: process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://ytsubs.thomaswt.com',
    public: {
      posthogPublicKey: 'phc_6KKOKOdFbfQSnmHW6OTGW9DU1qwhfuXiLtbqiWBdxzV',
      posthogHost: 'https://eu.i.posthog.com'
    }
  },
  // or sourcemap: true
  sourcemap: {
    server: true,
    client: true
  }
})