import { mapGetters } from 'vuex';
import _ from 'lodash';
import Utils from '@/plugins/utils';
import SelperCommonMixin from '@/components/SelperCommonMixin';
import UserAuthMixin from '@/components/UserAuthMixin';

const prefix = 'mypage/info';
const LOGIN_TARGET = 'lgn_tgt';

export default {
  mixins: [SelperCommonMixin, UserAuthMixin],
  middleware: 'userAuth',
  data: () => ({
    loading: false,
    isChange: false,
    password: '',
    message: '',
    isVerifyPassword: false,
    receptionTypeList: [],
    user_reception: [],
    passwords: {
      current: '',
      new: '',
      newCheck: '',
      message: '',
    },
    changeDisabled: false,
    userId: null,
    contact: { value: null, authNumber: null, message: null },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getCodes', 'reception_type');
    await store.dispatch(`${prefix}/getUserAgreedReceptions`);
  },
  created() {
    this.passwordCheck = _.debounce(() => {
      if (this.passwords.new === this.passwords.newCheck) this.passwords.message = '';
      else this.passwords.message = '비밀번호가 일치하지 않습니다.';
    }, 350);
    this.receptionTypeList = this.codesArray('reception_type');
    this.user_reception = this.receptions;
  },
  async mounted() {
    if (this.isSNSUser) {
      await this.$store.dispatch(`${prefix}/getSNSUserInfo`);
      if (this.verifyResult.result === 'success') this.isVerifyPassword = true;
      if (this.verifyResult.result === 'error') Utils.removeCookie(LOGIN_TARGET);
    }
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      userInfo: `${prefix}/userInfo`,
      deliveries: `${prefix}/deliveries`,
      receptions: `${prefix}/receptions`,
      verifyResult: `${prefix}/verifyResult`,
      result: `${prefix}/result`,
    }),
    allCheck: {
      get() {
        return this.receptionTypeList ? this.user_reception.length === this.receptionTypeList.length : false;
      },
      set(value) {
        const checked = [];
        if (value) {
          this.receptionTypeList.forEach((item) => {
            checked.push(item.key);
          });
        }
        this.changeDisabled = true;
        this.user_reception = checked;
      },
    },
  },
  watch: {
    passwords: {
      deep: true,
      handler() {
        if (this.passwords.current) this.changeDisabled = true;
        else if (this.passwords.new) this.changeDisabled = true;
        else if (this.passwords.newCheck) this.changeDisabled = true;
        else this.changeDisabled = false;
      },
    },
  },
  methods: {
    passwordCheck: () => {},
    async myInfoAuth() {
      this.message = '';
      if (this.password) {
        await this.$store.dispatch(`${prefix}/getVerifyUserInfo`, { password: this.password });
        if (this.verifyResult.result === 'success') this.isVerifyPassword = true;
        if (this.verifyResult.result === 'error') this.message = this.verifyResult.message;
      } else {
        this.message = '비밀번호를 입력해주세요.';
      }
    },
    phoneChange() {
      this.isChange = !this.isChange;
      if (this.isChange === true) this.contact = { value: null, authNumber: null, message: null };
      else delete this.contact;
    },
    async getAuthNumber() {
      this.loading = true;
      this.contact.message = '';
      if (!this.contact.value) {
        this.contact.message = '인증번호를 받기위해 휴대폰번호를 입력해주세요.';
        return;
      }
      await this.$store.dispatch(`${prefix}/getAuthNumber`, this.contact.value);
      this.loading = false;

      if (this.result.result === 'success') this.$popup.showAlertPopup('인증번호가 발송되었습니다. 입력창에 3분이내로 입력해주세요.');
      else this.contact.message = this.result.message;
    },
    async changePhoneNumber() {
      const isEmptyList = [];
      this.contact.message = '';
      if (!this.contact.value) isEmptyList.push('휴대폰 번호');
      if (!this.contact.authNumber) isEmptyList.push('인증번호');
      if (isEmptyList.length === 0) {
        const data = { send_to: this.contact.value, code: this.contact.authNumber };
        await this.$store.dispatch(`${prefix}/patchUserPhone`, data);
        if (this.result.result === 'success') {
          this.userInfo.phone = this.contact.value;
          this.$popup.showAlertPopup('회원님의 정보가 변경되었습니다.');
          await this.$router.push({ name: 'mypage-order' });
        } else this.$popup.showAlertPopup(this.result.message);
      } else {
        this.contact.message = `${isEmptyList.join('/')}를 입력해주세요.`;
      }
    },
    // TODO 배송지 목록 팝업
    popDeliveryList() {
      new this.$popup.DeliveryAddressList({
        propsData: {
          userId: this.userId,
          deliveries: this.deliveries,
        },
      }).$mount();
    },
    popLeave() {
      new this.$popup.LeaveReason({
        okCallback: async (params) => {
          if (params.leave_type && params.reason) {
            await this.$store.dispatch(`${prefix}/deleteUserLeave`, params);
            if (this.result.result === 'success') {
              this.$popup.showAlertPopup('탈퇴가 정상적으로 되었습니다.\n메인페이지로 이동합니다.');
              await this.$router.push({ name: 'main' });
            } else {
              this.$popup.showAlertPopup(this.result.message);
            }
          } else {
            this.$popup.showAlertPopup('탈퇴유형과 사유를 입력해주세요.');
          }
        },
      }).$mount();
    },
    async patchUserInfo() {
      const isEmptyList = [];
      if (this.isChange) {
        if (!this.contact.value) isEmptyList.push('휴대폰번호');
        if (!this.contact.authNumber) isEmptyList.push('인증번호');
      }

      if (!this.isSNSUser) {
        if (this.passwords.current || this.passwords.new || this.passwords.newCheck) {
          if (!this.passwords.current) isEmptyList.push('현재 비밀번호');
          if (this.passwords.message.length > 0) return this.$popup.showAlertPopup('신규 비밀번호가 일치하지 않습니다.');
        }

        if (isEmptyList.length > 0) return this.$popup.showAlertPopup(`다음 필수항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
        if (this.passwords.current && this.passwords.current === this.passwords.new) {
          return this.$popup.showAlertPopup('기존에 설정한 비밀번호로 변경할 수 없습니다.');
        }
      }
      if (isEmptyList.length > 0) return this.$popup.showAlertPopup(`다음 필수항목을 입력해주세요.\n${isEmptyList.join('\n')}`);

      const userInfo = {
        name: this.userInfo.name,
        email: this.userInfo.email,
        user_reception: this.user_reception,
        deliveries: this.deliveries,
      };
      if (this.isChange) {
        userInfo.phone = this.contact.value;
        userInfo.authNumber = this.contact.authNumber;
      }
      userInfo.password = this.passwords.current;
      if (this.passwords.message.length === 0 && this.passwords.new.length > 0) userInfo.new_password = this.passwords.new;
      else userInfo.new_password = null;

      await this.$store.dispatch(`${prefix}/patchUserInfo`, userInfo);
      if (this.result.result === 'success') {
        this.$popup.showAlertPopup('회원님의 정보가 변경되었습니다.');
        this.$router.go({ name: 'mypage-order' });
      } else {
        this.$popup.showAlertPopup(this.result.message);
      }
    },
    changeReception() {
      this.changeDisabled = true;
    },
  },
};
