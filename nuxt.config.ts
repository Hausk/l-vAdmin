export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon'
  ],
  hub: {
    database: true
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  devtools: {
    enabled: true
  },
  tailwindcss: {
    editorSupport: true
  }
})
