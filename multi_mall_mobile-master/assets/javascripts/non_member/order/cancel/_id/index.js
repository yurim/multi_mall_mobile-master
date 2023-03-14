import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'non_member/order/cancel/_id';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    reasonSubTypeCodes: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
    order_product_cancel: {
      order_product_id: '',
      reason_sub_type: '',
      reason: '',
      collect_delivery_type: '',
      collect_fee_type: '',
    },
    cancelProductPrice: 0,
    cancelDeliveryPrice: 0,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getClaimOrderProduct`, params.id);
    await store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type']);
    await store.dispatch('common/getCodes', 'delivery_company');
    await store.dispatch('common/getAgreements', ['rtrn']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      codesValueArray: 'common/codesValueArray',
      orderProduct: `${prefix}/orderProduct`,
      result: `${prefix}/result`,
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    this.init();
  },
  methods: {
    initCommonCodes() {
      this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_CNCL');
      this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
      this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'RTRN');
    },
    init() {
      this.order_product_cancel.order_product_id = String(this.orderProduct.id);
      this.initCommonCodes();

      // init cancel price
      this.cancelProductPrice = this.orderProduct.product_discount_price ? this.orderProduct.product_discount_price : this.orderProduct.product_price;
      this.cancelDeliveryPrice = this.orderProduct.delivery_fee ? this.orderProduct.delivery_fee : 0;
    },
    async requestCancel() {
      const that = this;
      const isEmptyList = [];

      if (!that.order_product_cancel.reason_sub_type) isEmptyList.push('반품 사유');
      if (!that.order_product_cancel.reason) isEmptyList.push('반품 사유 내용');

      if (isEmptyList.length === 0) {
        await that.$store.dispatch(`${prefix}/setOrderProductCancel`, that.order_product_cancel);
        if (that.result.result === 'success') {
          that.popupAlert('취소신청이 접수되었습니다.');
          that.$router.push({ name: 'non_member-order' });
        } else {
          that.popupAlert(that.result.message);
        }
      } else {
        that.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
      }
    },
    popTerms(agreementType, agreementTypeStr) {
      new Popup.Terms({
        propsData: {
          title: agreementTypeStr,
          message: this.agreementObject(agreementType).content,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
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
