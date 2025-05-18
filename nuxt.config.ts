import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@element-plus/nuxt'],
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  app: {
    head: {
      title: 'Phần mềm nhà xe - VinaHome',
      charset: "utf-8",
      meta: [
        { name: 'description', content: 'Phần mềm quản lý nhà xe' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
     
    }
  },
  runtimeConfig: {
    public: {
      apiGateWay: process.env.NUXT_PUBLIC_API_GATEWAY,
    }
  },
})