// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/motion/nuxt', '@nuxt/fonts'],
  runtimeConfig: {
    domain: process.env.DOMAIN,
    path_to_store_temp_files: process.env.PATH_TO_STORE_TEMP_FILES,
    public: {
      path_to_download_files: process.env.PATH_TO_DOWNLOAD_FILES,
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY,
      posthogHost: process.env.POSTHOG_HOST
    }
  },
  // or sourcemap: true
  sourcemap: {
    server: true,
    client: true
  }
})