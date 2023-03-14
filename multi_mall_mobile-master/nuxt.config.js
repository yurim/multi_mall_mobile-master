// Meta tag
const metaTags = [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no,maximum-scale=1.0' },
  // TODO description 연동 확인
  { hid: 'description', name: 'description', content: '해외직구의 모든 것! 50% 반값할인 해외직구 종합 쇼핑몰 몰리. 회원가입 시 2000원 포인트 지급!' },

  // TODO 아래 content에 슈퍼어드민에서 받은 ogimage url을 넣어줘야함
  { hid: 'og:image', property: 'og:image', content: '/ogImage.png' },
];

const ROUTER_BASE_MAP = {
  total: '/m',
};

// router base url
let routerBase = ''; // default
if (process.env.NODE_ENV === 'staging') {
  routerBase = ROUTER_BASE_MAP.total;
}

const scripts = [
  { src: 'https://code.jquery.com/jquery-3.5.1.min.js', type: 'text/javascript' },
  { src: 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js', type: 'text/javascript' },
  { src: 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/lang/summernote-ko-KR.min.js', type: 'text/javascript' },
  { src: 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js' },
  { src: 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' },
  { src: 'http://wcs.naver.net/wcslog.js', type: 'text/javascript' },
  // 푸터 토스관련 js
  { src: 'https://pgweb.dacom.net/WEB_SERVER/js/escrowValid.js', type: 'text/javascript' },
];

const SELPER_JS = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KGCFJL3');`;

const FACEBOOK_PIXEL_JS = `!function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      window.facebookPixelId = ${process.env.FACEBOOK_PIXEL_ID};`;

if (process.env.NODE_ENV === 'production') {
  metaTags.push({ name: 'google-site-verification', content: 'Zjg97AadvX-7Giq31VBwWoQF8jkwIQWjpr9OFRGJanc' });
  metaTags.push({ name: 'facebook-domain-verification', content: '7n7ki5h3bcbqqp8gewb0nr4z4oyy5c' });
  metaTags.push({ property: 'product:catalog_id', content: process.env.FACEBOOK_CATALOG_ID });
  scripts.push({ src: 'https://pay.naver.com/customer/js/mobile/naverPayButton.js', type: 'text/javascript' });
  scripts.push({ innerHTML: SELPER_JS, type: 'text/javascript' });
  scripts.push({ innerHTML: FACEBOOK_PIXEL_JS, type: 'text/javascript' });
} if (process.env.NODE_ENV === 'staging') { // todo: 스테이징 셀퍼 테스트 후 삭제
  metaTags.push({ name: 'google-site-verification', content: 'Zjg97AadvX-7Giq31VBwWoQF8jkwIQWjpr9OFRGJanc' });
  metaTags.push({ name: 'facebook-domain-verification', content: '7n7ki5h3bcbqqp8gewb0nr4z4oyy5c' });
  metaTags.push({ property: 'product:catalog_id', content: process.env.FACEBOOK_CATALOG_ID });
  scripts.push({ src: 'https://test-pay.naver.com/customer/js/mobile/naverPayButton.js', type: 'text/javascript' });
  scripts.push({ innerHTML: SELPER_JS, type: 'text/javascript' });
  scripts.push({ innerHTML: FACEBOOK_PIXEL_JS, type: 'text/javascript' });
} else {
  scripts.push({ src: 'https://test-pay.naver.com/customer/js/mobile/naverPayButton.js', type: 'text/javascript' });
}

export default {
  server: {
    port: 3001,
    host: '0.0.0.0', // local 에서만 접속 가능(접속 open 시 0.0.0.0)
  },
  ssr: true,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  publicRuntimeConfig: {
  },
  head: {
    titleTemplate: `%s - ${process.env.npm_package_name}`,
    title: process.env.npm_package_name || '',
    meta: metaTags,
    link: [
      // TODO 아래 href에 슈퍼어드민에서 받은 파비콘 url을 넣어줘야함
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css' },
    ],
    script: scripts,
    __dangerouslyDisableSanitizers: ['script'],
  },
  /*
   ** Global CSS
   */
  css: [
    'vue-multiselect/dist/vue-multiselect.min.css',
    // 기본
    '@assets/css/reset.scss',
    '@assets/css/common.scss',
    '@assets/css/font.scss',
    '@assets/css/chart.scss',
    '@assets/css/layout.scss',
    '@assets/css/popup.scss',
    '@assets/css/reset_button.scss',
    '@assets/css/reset_input.scss',
    '@assets/css/reset_table.scss',
    '@assets/css/scroll.scss',
    '@assets/css/star_rate.scss',
    '@assets/css/tooltip.scss',

    // 라이브러리
    '@assets/css/lib/vue_select.scss',
    '@assets/css/lib/swiper.scss',
    '@assets/css/lib/vuetify.scss',
    'swiper/css/swiper.css',
    '@assets/css/lib/sticky.scss',
    '@assets/css/lib/swiper_article.scss',

    // scss
    '@assets/css/mixin.scss',
    '@assets/css/variable_list.scss',
    // page
    '@assets/css/main.scss',
    '@assets/css/page/request.scss',
    '@assets/css/page/login.scss',
    '@assets/css/page/order.scss',
    '@assets/css/page/mypage.scss',
    '@assets/css/page/compare_price.scss',
    '@assets/css/page/about.scss',
    // show
    '@assets/css/show/product.scss',
    '@assets/css/show/store.scss',
    // style
    '@assets/css/input_list.scss',
    // list
    '@assets/css/list/index.scss',
    '@assets/css/list/store.scss',
    // popup
    '@assets/css/popup/popup.scss',
    '@assets/css/popup/popup_product.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '@plugins/ClientComponent.js', mode: 'client' },
    { src: '@plugins/infiniteLoading.js', ssr: (process.env.NODE_ENV !== 'development') },
    '@plugins/GlobalComponent.js',
    '@plugins/GlobalMixin.js',
    '@/plugins/axios',
    { src: '@plugins/iamport.js', ssr: false, injectAs: 'IMP' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module', // Doc: https://github.com/nuxt-community/eslint-module
    ['@nuxtjs/dotenv', {
      filename:
        process.env.NODE_ENV === 'development' ? '.env' : `.env.${process.env.NODE_ENV}.${process.env.DEPLOY_TARGET}`,
      systemvars: true,
    }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    'vue-daum-postcode/nuxt',
    '@nuxtjs/redirect-module',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    https: process.env.NODE_ENV === 'production',
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // extend(config, ctx) {
    //   if (ctx.isDev) {
    //     config.entry.push('eventsource-polyfill');
    //   }
    // },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
      ],
      babelrc: false,
      presets(env) {
        const envTargets = {
          client: { browsers: ['last 2 versions'], ie: 11 },
          server: { node: 'current' },
        };
        const envUseBuiltins = {
          client: 'usage',
          modern: 'entry',
        };

        return [
          [
            '@nuxt/babel-preset-app', {
              useBuiltIns: envUseBuiltins[env.envName],
              targets: envTargets[env.envName],
              corejs: { version: 3 },
            },
          ],
        ];
      },
    },
  },
  router: {
    base: routerBase,
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'pageNotFound',
        path: '*',
        component: resolve(__dirname, 'client/pages/404.vue'),
      });
    },
  },
  /*
   ** Redirect configuration
   ** https://github.com/nuxt-community/redirect-module
   */
  redirect: [
    { from: /^\/?$/, to: `${routerBase}/main` },
  ],
};
