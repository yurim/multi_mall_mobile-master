import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'user/regist/sns';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    agreements: [
      { text: '이용약관(필수)', value: 'terms' },
      { text: '개인정보수집이용동의(필수)', value: 'privacy' },
      { text: '개인정보 제3자 제공동의(선택)', value: 'third' },
    ],
    checked: [],
    userInfo: {
      email: { text: '이메일', value: '', message: '' },
      name: { text: '이름', value: '', message: '' },
      phone: { text: '전화 번호', value: '', message: '' },
      authNumber: { text: '인증번호', value: '', message: '' },
    },
    isAuth: false,
    agreementMessage: '',
    registAllow: true,
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getAgreements`);
  },
  created() {
    // init sns info
    this.userInfo.email.value = this.$route.params.email;
    this.userInfo.name.value = this.$route.params.name;

    this.agreementList.forEach((item) => {
      Array.prototype.find.call(this.agreements, (agreement) => {
        if (item.agreement_type.toLowerCase() === agreement.value) agreement.content = item.content;
      });
    });
  },
  mounted() {
    if (!Object.keys(this.$route.params).length) {
      this.popupAlert('SNS 로그인을 다시 진행해주세요.');
      this.$router.replace({ name: 'user-login' });
    }
  },
  computed: {
    allCheck: {
      get() {
        return this.agreements ? this.checked.length === this.agreements.length : false;
      },
      set(value) {
        const checked = [];
        if (value) {
          this.agreements.forEach((agreement) => {
            checked.push(agreement.value);
          });
        }
        this.checked = checked;
      },
    },
    ...mapGetters({
      agreementList: `${prefix}/agreements`,
      result: `${prefix}/result`,
    }),
  },
  watch: {
    /**
     * 전화번호 변경 시 인증 초기화
     */
    'userInfo.phone.value': {
      handler() {
        this.isAuth = false;
      },
    },
  },
  methods: {
    phoneValidation(phone) {
      const re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
      return re.test(phone);
    },
    validation(email) {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      return re.test(email);
    },
    validationCheck(e) {
      const id = e.target.id;
      const that = this;
      if (id === 'email') {
        const emailValid = that.validation(that.userInfo[id].value);
        if (emailValid === false) that.userInfo[id].message = '이메일이 올바르지 않습니다.';
        else that.userInfo[id].message = '';
      }
      if (id === 'name') {
        if (!that.userInfo[id].value) that.userInfo[id].message = '이름을 입력해주세요.';
        else that.userInfo[id].message = '';
      }
      if (id === 'phone') {
        const phoneValid = that.phoneValidation(that.userInfo[id].value);
        if (phoneValid === false) that.userInfo[id].message = '전화번호가 올바르지 않습니다.';
        else that.userInfo[id].message = '';
      }
      if (id === 'authNumber') {
        if (!that.userInfo[id].value) that.userInfo[id].message = '인증번호를 입력해주세요.';
        else that.userInfo[id].message = '';
      }
    },
    showTerms(e) {
      const idx = e.target.id;
      new Popup.Terms({
        propsData: {
          title: this.agreements[idx].text,
          message: this.agreements[idx].content,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    async createSNSUserInfo() {
      const that = this;
      const keys = Object.keys(that.userInfo);
      keys.forEach((key) => {
        if (that.userInfo[key].value) {
          that.userInfo[key].message = '';
          that.registAllow = true;
        } else {
          that.userInfo[key].message = `${that.userInfo[key].text}(을)를 입력해주세요.`;
          that.registAllow = false;
        }
      });
      if (!that.isAuth) {
        this.popupAlert('전화번호 인증을 해주세요.');
        that.registAllow = false;
      }
      if (that.registAllow === true) {
        if (that.checked.includes('terms') && that.checked.includes('privacy')) {
          that.agreementMessage = '';
          const userInfo = {
            provider: this.$route.params.provider,
            token: this.$route.params.token,
            uid: this.$route.params.uid,
            expires_at: this.$route.params.expires_at,
          };
          Object.keys(that.userInfo).forEach((key) => {
            userInfo[key] = that.userInfo[key].value;
          });
          await this.$store.dispatch(`${prefix}/createSNSUser`, userInfo);
          if (that.result.result === 'success') {
            new that.$popup.UserRegistCompleted({
              propsData: {
                signUpPoint: that.result.data.sign_up_point ? that.result.data.sign_up_point : 0,
                okCallback(params) {
                  params.$destroy();
                },
              },
            }).$mount();
            that.$router.replace({ name: 'main' });
            if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
              this.initSelper();
            }
          } else {
            that.popupAlert(that.result.message);
          }
        } else {
          that.agreementMessage = '필수 약관에 동의해주세요.';
        }
      }
    },
    initSelper() {
      const intv = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (__trackSelperCompleteRegistration) {
          // eslint-disable-next-line no-undef
          __trackSelperCompleteRegistration();
          clearInterval(intv);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(intv);
      }, 5000);
    },
    /**
     * SMS 인증번호 받기
     */
    async sendSMSAuth() {
      // check phone
      const phoneValid = this.phoneValidation(this.userInfo.phone.value);
      if (phoneValid === false) {
        this.userInfo.phone.message = '전화번호가 올바르지 않습니다.';
        return;
      }
      this.userInfo.phone.message = '';

      // send
      const data = { phone: this.userInfo.phone.value };
      const result = await this.$store.dispatch(`${prefix}/sendSMSAuth`, data);
      if (result.result === 'success') {
        this.popupAlert('인증번호가 발송되었습니다. 입력창에 3분이내로 입력해주세요.');
      } else {
        this.popupAlert(result.message);
      }
    },
    /**
     * SMS 인증 하기
     */
    async verifySMSAuth() {
      // check phone, auth number
      const phoneValid = this.phoneValidation(this.userInfo.phone.value);
      if (phoneValid === false) {
        this.userInfo.phone.message = '전화번호가 올바르지 않습니다.';
        return;
      }
      this.userInfo.phone.message = '';

      if (!this.userInfo.authNumber.value) {
        this.userInfo.authNumber.message = '인증번호를 입력해주세요.';
        return;
      }
      this.userInfo.authNumber.message = '';

      // send
      const data = { phone: this.userInfo.phone.value, code: this.userInfo.authNumber.value };
      const result = await this.$store.dispatch(`${prefix}/verifySMSAuth`, data);
      if (result.result === 'success') {
        this.popupAlert('인증 되었습니다');
        this.isAuth = true;
      } else {
        this.popupAlert(result.message);
        this.isAuth = false;
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
