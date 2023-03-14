import Popup from '@/components/popups/popup';
import { mapGetters } from 'vuex';

const prefix = 'user/login';

export default {
  data: () => ({
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getSNSClientIDs`);
  },
  computed: {
    ...mapGetters({
      snsIds: `${prefix}/snsIds`,
    }),
  },
  async mounted() {
    // init naver login
    // eslint-disable-next-line no-undef
    const naverLogin = new naver.LoginWithNaverId({
      clientId: this.snsIds.NAVER_CLIENT_ID,
      callbackUrl: `${window.location.origin}/user/oauth_callback/naver`,
      callbackHandle: true,
    });
    naverLogin.init();

    // get profile
    naverLogin.getLoginStatus(async (status) => {
      if (status) {
        const email = naverLogin.user.email;
        const name = naverLogin.user.name;
        if (!email || !name) {
          this.popupAlert('이메일, 이름은 필수정보입니다. 정보제공을 동의해주세요.');
          naverLogin.reprompt();
          return;
        }

        // sns login
        const data = {
          provider: 'NAVER',
          uid: naverLogin.user.id,
        };
        const result = await this.$store.dispatch(`${prefix}/loginSNSUser`, data);
        if (result.result === 'success') { // 로그인
          this.$router.replace({ name: 'main' });
        } else if (result.result === 'error' && result.error_code === '411') { // 회원가입
          data.token = naverLogin.accessToken.accessToken;
          data.expires_at = this.$moment.utc(1000 * naverLogin.accessToken.expires).format();
          data.email = email;
          data.name = name;

          this.$router.replace({ name: 'user-regist-sns', params: data });
        } else { // 오류
          this.popupAlert(result.message);
          this.$router.replace({ name: 'user-login' });
        }
      } else { // 오류
        this.popupAlert('오류가 발생했습니다.');
        this.$router.replace({ name: 'user-login' });
      }
    });
  },
  methods: {
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
