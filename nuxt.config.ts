export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    'fume.care',
    // '../care/src/module',
    'nuxt-auth-utils',
    'nuxt-api-utils',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      url: '',
      prefix: 'ajdone',
      care: {
        apiKey: '',
        apiDomain: '',
        verbose: true,
        userFromAuthUtils: true,
      },
    },
    session: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      name: 'ajdone-session',
      password: '',
    },
    oauth: {
      google: {
        clientId: '',
        clientSecret: '',
        redirectURL: '',
      },
      github: {
        clientId: '',
        clientSecret: '',
        redirectURL: '',
      },
    },
  },

  devServer: {
    port: 3001,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  hub: {
    database: true,
    blob: true,
  },

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
