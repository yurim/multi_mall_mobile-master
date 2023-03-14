import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import _ from 'lodash';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'user/find/password';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    userInfo: {
      name: '',
      email: '',
      phone: '',
      authNumber: '',
      message: '',
    },
    isChangePassword: false,
    changeUserInfo: {
      email: '',
      newPassword: '',
      newPasswordConfirm: '',
      message: '',
    },
    changeAuth: '',
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.validateEmail = _.debounce(() => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(this.userInfo.email).toLowerCase())) this.userInfo.message = '';
      else this.userInfo.message = '이메일 형식을 올바르게 입력해주세요.';
    }, 300);

    this.validatePassword = _.debounce(() => {
      const isNum = this.changeUserInfo.newPassword ? this.changeUserInfo.newPassword.search(/[0-9]/g) > -1 : false;
      const isEng = this.changeUserInfo.newPassword ? this.changeUserInfo.newPassword.search(/[a-zA-Z]/g) > -1 : false;
      const isSpe = this.changeUserInfo.newPassword ? this.changeUserInfo.newPassword.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi) > -1 : false;

      if (this.changeUserInfo.newPassword.length < 8) this.changeUserInfo.message = '비밀번호를 8자 이상 입력해주세요.';
      else if (this.changeUserInfo.newPassword.search(/\s/) > -1) this.changeUserInfo.message = '공백을 제외한 8자 이내로 입력해주세요.';
      else if (!isNum || !isEng || !isSpe) this.changeUserInfo.message = '영문, 숫자, 특수문자를 조합하여 입력해주세요.';
      else if (this.changeUserInfo.newPassword !== this.changeUserInfo.newPasswordConfirm) this.changeUserInfo.message = '비밀번호가 일치하지 않습니다.';
      else this.changeUserInfo.message = '';
    }, 300);
  },
  methods: {
    validateEmail: () => {},
    validatePassword: () => {},
    async getVerifyNumber() {
      const that = this;
      await that.$store.dispatch(`${prefix}/getVerifyNumber`, that.userInfo.phone);
      if (that.result.result === 'success') that.userInfo.message = '휴대폰으로 인증번호를 전송하였습니다. 3분이내로 입력해주세요.';
      else that.userInfo.message = that.result.message;
    },
    async findPassword() {
      const that = this;
      const isEmptyList = [];
      that.userInfo.message = '';
      if (!that.userInfo.name) isEmptyList.push('이름');
      if (!that.userInfo.email) isEmptyList.push('이메일');
      if (!that.userInfo.phone) isEmptyList.push('전화번호');
      if (!that.userInfo.authNumber) isEmptyList.push('인증번호');

      if (isEmptyList.length > 0) {
        that.userInfo.message = `${isEmptyList.join('/')}를 입력해주세요.`;
      } else {
        const res = await that.$store.dispatch(`${prefix}/getFindPassword`, that.userInfo);
        if (res.result === 'success') {
          that.isChangePassword = true;
          that.changeUserInfo.email = that.userInfo.email;
          that.changeAuth = res.data.auth;
        } else {
          that.userInfo.message = res.message;
          that.changeAuth = '';
        }
      }
    },
    async changePassword() {
      if (!this.changeAuth) this.popupAlert('오류가 발생했습니다. 비밀번호 찾기를 다시 진행 해주세요.');
      const that = this;
      const isEmptyList = [];
      that.changeUserInfo.message = '';
      if (!that.changeUserInfo.newPassword) isEmptyList.push('이름');
      if (!that.changeUserInfo.newPasswordConfirm) isEmptyList.push('이름');
      if (isEmptyList.length > 0) {
        that.userInfo.message = `${isEmptyList.join('/')}를 입력해주세요.`;
        return;
      }
      if (that.changeUserInfo.newPassword !== that.changeUserInfo.newPasswordConfirm) {
        that.userInfo.message = '비밀번호와 비밀번호 확인이 다릅니다.';
        return;
      }

      const params = {
        email: that.changeUserInfo.email,
        password: that.changeUserInfo.newPassword,
        change_auth: that.changeAuth,
      };
      await that.$store.dispatch(`${prefix}/patchUserPassword`, params);
      if (that.result.result === 'success') {
        that.$router.push({ name: 'user-login' });
        that.popupAlert('비밀번호가 변경되었습니다.\n로그인화면으로 이동합니다.');
      } else {
        that.popupAlert(that.result.message);
      }
    },
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
