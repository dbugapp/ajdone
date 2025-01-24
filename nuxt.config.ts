export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    'fume.care',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      care: {
        apiKey: '0ep9iok8gkgaexerq21f6d5mzm6j7z0b',
        apiDomain: 'http://localhost:3000',
        verbose: true,
      },
    },
  },

  devServer: {
    port: 3001,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  hub: {},

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
