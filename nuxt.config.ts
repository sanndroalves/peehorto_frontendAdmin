export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false
  },
  build: {
    transpile: ["vuetify", '@nuxtjs/vuex', '@vue-leaflet/vue-leaflet', 'leaflet'],
  },
  css: [
    'leaflet/dist/leaflet.css'
  ],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  modules: [
    '@sidebase/nuxt-auth'
  ],
  auth: {
    baseURL: 'https://peehorto.cloud', // endereço do backend
    provider: {
      type: 'local', // biblioteca sidebase no modo local (webToken)
      endpoints: {
        signIn: { path: '/token/login', method: 'post' }, // endereço do djoser
        signOut: { path: '/token/logout', method: 'post' }, // endereço do djoser
        getSession: { path: '/users', method: 'get' } // endereço para confirmar token
      },
      token: { signInResponseTokenPointer: '/auth_token', type: 'Token' },
      pages: { login: '../../auth/login' }
    }
  }
});
