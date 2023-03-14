import Utils from '@/plugins/utils';

const CSRF_URL = '/csrf/';
const KEY_CSRF = 'csrf';
const KEY_JWT = 'jwt';
const KEY_JWT_NON_MEMBER = 'jwtNonMember';
const HEADER_CSRF_TOKEN = 'X-CSRFTOKEN';
const HEADER_CSRF_UNIQUE_ID = 'X-CSRFUNIQUEID';
const HEADER_JWT_TOKEN = 'X-JWT';
const HEADER_JWT_TOKEN_NON_MEMBER = 'X-JWTNONMEMBER';

export default function axios({ $axios, redirect }) {
  $axios.interceptors.request.use(async (config) => {
    config.baseURL = process.env.BASE_URL;
    const isClient = typeof document !== 'undefined';
    if (config.url === CSRF_URL) return config;
    let csrf = Utils.getCookie(config.headers.common.cookie, KEY_CSRF);
    let jwt = Utils.getCookie(config.headers.common.cookie, KEY_JWT);
    let jwtNonMember = Utils.getCookie(config.headers.common.cookie, KEY_JWT_NON_MEMBER);
    if (!csrf && isClient) csrf = Utils.getCookie(document.cookie, KEY_CSRF);
    if (!jwt && isClient) jwt = Utils.getCookie(document.cookie, KEY_JWT);
    if (!jwtNonMember && isClient) jwtNonMember = Utils.getCookie(document.cookie, KEY_JWT_NON_MEMBER);

    if (csrf) {
      csrf = JSON.parse(csrf);
      const expired = new Date(csrf.csrf_expired);
      if (Date.now() > expired.getTime()) {
        Utils.removeCookie(KEY_CSRF);
        csrf = null;
      }
    }

    if (!csrf) {
      const result = await $axios.$get(CSRF_URL);
      csrf = result.data;
      Utils.addCookie(KEY_CSRF, JSON.stringify(result.data));
    }

    if (jwt) {
      config.headers[HEADER_JWT_TOKEN] = jwt;
      const info = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
      const userGrade = info.info.split('_')[1];
      const path = config.url;
      if (path.search('super_admin') > -1) {
        if (path.search('category') === -1) {
          if (userGrade === '1') redirect('/admin/user/login');
          if (!userGrade) redirect('/user/login?need_login=true');
        }
      }
    }

    if (jwtNonMember) {
      config.headers[HEADER_JWT_TOKEN_NON_MEMBER] = jwtNonMember;
    }

    config.headers[HEADER_CSRF_TOKEN] = csrf.csrf_token;
    config.headers[HEADER_CSRF_UNIQUE_ID] = csrf.csrf_uniqueid;
    return config;
  });
  $axios.interceptors.response.use((res) => {
    const errorCode = res.data.error_code;
    if (errorCode && errorCode === '461') {
      Utils.removeCookie(KEY_JWT);
      if (res.data.data.grade === 0) redirect('/user/login?need_login=true');
      else redirect(`/admin/user/login?need_login=true&grade=${res.data.data.grade}`);
    }
    if (errorCode && errorCode === '460') {
      Utils.removeCookie(KEY_JWT);
      redirect('/user/login?need_login=true');
    }
    return Promise.resolve(res);
  }, (error) => {
    // 500: 서버 에러 처리
    console.log('500: 서버 에러', error);
    return Promise.reject(error);
  });
}
