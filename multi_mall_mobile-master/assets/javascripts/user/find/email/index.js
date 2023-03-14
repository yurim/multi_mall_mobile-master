import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'user/find/email';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    userInfo: {
      send_to: '',
      code: '',
    },
    message: '',
    email: '',
    isAccount: false,
    accountMessage: '',
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
    phoneValidation(phone) {
      const re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
      return re.test(phone);
    },
    async getCode() {
      this.message = '';
      if (!this.userInfo.send_to) this.message = '전화번호를 입력해주세요.';
      else await this.$store.dispatch(`${prefix}/getCode`, this.userInfo.send_to);

      if (this.result.result === 'success') {
        this.message = '인증번호가 전송되었습니다. 3분 이내로 작성해주세요.';
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }
    },
    async findEmail() {
      const that = this;
      const isEmptyList = [];
      if (!that.userInfo.send_to) isEmptyList.push('전화번호');
      if (!that.userInfo.code) isEmptyList.push('인증번호');
      if (isEmptyList.length === 0) {
        await that.$store.dispatch(`${prefix}/getFindEamil`, that.userInfo);
        if (that.result.result === 'success') {
          that.isAccount = true;
          that.email = that.result.data.email;
        } else {
          that.accountMessage = that.result.message;
        }
      } else {
        that.message = `${isEmptyList.join(' / ')}를 입력해주세요.`;
      }
    },
  },
};
