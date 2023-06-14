// 스크립트를 통해 --dotenv .env.prd 파일을 지정해주도록 한다.
// 위의 기능을 위해, 아래와 같이 한번 config 함수를 호출시켜줘야 한다.
// require('dotenv').config();
// 위 기능 작동 안됨. 아래로 변경.
// console.log(process.env.PHASE);
// require('dotenv').config({filename: `.env.${process.env.PHASE}`});

// https://v3.nuxtjs.org/api/configuration/nuxt.config\

export default defineNuxtConfig({
  // Global Head
  app: {
    head: {
      charset: 'utf-8',
      // viewport: 'width=500, initial-scale=1',
      title: '휴게소 정보',
      meta: [{ name: 'Nuxt3, Pinia, TypeScript 로 구성된 프레임워크', content: '개발을 위한 기본 프레임워크' }],
      script: [
        { type: 'text/javascript', src: 'https://www.gstatic.com/charts/loader.js' },
        {
          type: 'text/javascript',
          src: 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=59464d0b8915087679175165eb6f70ce&libraries=services,clusterer,drawing',
        },
      ],
      link: [{ href: 'https://fonts.googleapis.com/icon?family=Material+Icons', rel: 'stylesheet' }],
    },
  },
  // modules
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', 'nuxt-quasar-ui'],

  build: {
    parallel: true,
    cache: true,
    hardSource: true,
  },

  css: ['mdi/css/materialdesignicons.min.css', '~/assets/css/main.scss'],

  quasar: {
    extras: ['material-icons'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    config: {
      brand: {
        primary: '#1976d2',
        secondary: '#26A69A',
        accent: '#9C27B0',

        dark: '#1d1d1d',
        'dark-page': '#121212',

        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
    server: {
      proxy: {
        '/portal/monitor/chlist': {
          target: 'https://www.ev.or.kr',
          changeOrigin: true,
        },
      },
    },
  },

  // plugins
  plugins: [],

  i18n: {
    locales: [
      {
        code: 'ko',
        file: 'ko.js',
        iso: 'ko-KR',
      },
      { code: 'en', file: 'en.js', iso: 'en-US' },
    ],
    defaultLocale: 'ko',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    vueI18n: {
      legacy: false,
      locale: 'ko',
      fallbackLocale: 'ko',
      availableLocales: ['en', 'ko'],
    },
  },

  runtimeConfig: {
    public: {
      NUXT_PUBLIC_OPENAPI_URL: process.env.NUXT_PUBLIC_OPENAPI_URL,
      NUXT_PUBLIC_EV_URL: process.env.NUXT_PUBLIC_EV_URL,
    },
  },
});
