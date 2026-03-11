// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxthub/core',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
    '@pinia/nuxt',
  ],

  hub: {
    database: true,
    kv: true,
  },

  // Runtime config for admin operations
  runtimeConfig: {
    // Server-only (not exposed to client)
    adminSecretKey: '', // Set via NUXT_ADMIN_SECRET_KEY env var
    // Public config (exposed to client)
    public: {
      demo: false, // Set via NUXT_PUBLIC_DEMO env var
    },
  },

  // Pinia configuration
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
});
