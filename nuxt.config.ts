// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Se estiver usando server-side rendering
  target: 'server', // Se estiver usando server-side rendering
 
  serverMiddleware: [
    { path: '/api', handler: '~/api' }
  ],
  typescript: {
    shim: false
  },
  build: {
    transpile: ["vuetify", '@nuxtjs/vuex'],
  },
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
    baseURL: 'https://peehorto.cloud',//endereço do backend
    provider: {
      type: 'local',//biblioteca sidebase no modo local (webToken)
      endpoints: {
        signIn: { path: '/token/login', method: 'post' },//endereço do djoser
        signOut: { path: '/token/logout', method: 'post' },//endereço do djoser
        //signUp: false,//criar usuário novo (desativado temporáriamente)
        getSession: { path: '/users', method: 'get' },//endereço p/ confirmar token
      },
      token: { signInResponseTokenPointer: '/auth_token', type: 'Token' },
      pages: { login: '../../auth/login' }
    }
  }
})


