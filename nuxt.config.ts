export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        // DNS prefetch for external APIs & image CDN
        { rel: 'dns-prefetch', href: 'https://www.darelmarsa.com' },
        { rel: 'dns-prefetch', href: 'https://rate.picscache.com' },
        { rel: 'dns-prefetch', href: 'https://basemaps.cartocdn.com' },
        // Preconnect for image CDN (most critical external resource)
        { rel: 'preconnect', href: 'https://rate.picscache.com', crossorigin: '' },
      ]
    }
  },

  css: [
    '~/templates/template1/assets/css/main.css',
    '~/templates/template2/assets/css/main.css',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/templates/template1/components', pathPrefix: false },
    { path: '~/templates/template3/components', pathPrefix: false },
    { path: '~/templates/template2/components', pathPrefix: false },
  ],

  // Vite build optimizations
  vite: {
    build: {
      // Split large chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'leaflet': ['leaflet'],
          }
        }
      },
      // Minify CSS
      cssMinify: true,
    },
    // Optimize deps pre-bundling
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    }
  },

  experimental: {
    // Extract payload for better performance
    payloadExtraction: true,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'app-root',
    },
  },

  compatibilityDate: '2025-01-29'
})
