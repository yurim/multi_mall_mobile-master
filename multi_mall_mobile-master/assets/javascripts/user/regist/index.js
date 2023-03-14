import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'user/login';

export default {
  mixins: [SelperCommonMixin],
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getSNSClientIDs`);
  },
  computed: {
    ...mapGetters({
      userInfo: `${prefix}/userInfo`,
      result: `${prefix}/result`,
      snsIds: `${prefix}/snsIds`,
    }),
  },
  mounted() {
    this.initNaverLogin();
  },
  methods: {
    initNaverLogin() {
      // eslint-disable-next-line no-undef
      const naverIdLogin = new naver.LoginWithNaverId({
        clientId: this.snsIds.NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/user/oauth_callback/naver`,
        isPopup: false,
      });
      naverIdLogin.init();
    },
  },
};
