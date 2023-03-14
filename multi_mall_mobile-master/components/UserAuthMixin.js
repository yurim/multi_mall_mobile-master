import Utils from '@/plugins/utils';

const JWT = 'jwt';
const LOGIN_TARGET = 'lgn_tgt';

/**
 * 로그인 여부
 * 로그인 중인 유저의 정보
 */
export default {
  data: () => ({
    isLogin: false,
    userId: null,
    userGrade: null,
    isNormalUser: null,
    isSNSUser: false,
  }),
  beforeMount() {
    const jwt = Utils.getCookie(document.cookie, JWT);
    const snsTarget = Utils.getCookie(document.cookie, LOGIN_TARGET);

    this.isLogin = !!jwt;
    if (!jwt) return;

    const userInfo = JSON.parse(atob(jwt.split('.')[1]));
    this.userId = parseInt(userInfo.info.split('_')[0], 10);
    this.userGrade = parseInt(userInfo.info.split('_')[1], 10);
    this.isNormalUser = this.userId && !this.userGrade;

    if (snsTarget && snsTarget === 'sns') {
      this.isSNSUser = true;
    }
  },
};
