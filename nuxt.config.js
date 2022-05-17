export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Farmers Markets',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'theme-color', content: '#2b3201' },
        ],
        link: [],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['~/assets/styles/main'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [{ src: '~/plugins/client/detect.ts', mode: 'client' }],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        '@nuxtjs/style-resources',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
        baseURL: '/',
    },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en',
        },
        meta: {
            name: 'Farmers Markets',
            theme_color: '#2b3201',
            author: false,
            ogTitle: false,
            ogType: false,
            ogDescription: false,
        },
        icon: {
            source: 'static/icon/favicon.png',
            filename: 'favicon.png',
            sizes: [64, 120, 144, 152, 192, 384, 512],
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    styleResources: {
        scss: '~/assets/styles/abstracts/_abstracts.scss',
    },
};
