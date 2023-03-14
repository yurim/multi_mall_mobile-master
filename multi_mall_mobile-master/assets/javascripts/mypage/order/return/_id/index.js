import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/order/return/_id';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    reasonSubTypeCodes: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
    selectedReasonObject: '',
    order_product_return: {
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
    await store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type', 'reason_responsible_for']);
    await store.dispatch('common/getCodes', 'delivery_company');
  },
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
      filteredCode: 'common/filteredCode',
      orderProduct: `${prefix}/orderProduct`,
      deliveryInfo: `${prefix}/deliveryInfo`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    initCommonCodes() {
      this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_RTRN');
      this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
      this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'RTRN');
      this.reasonSubTypeCodes.forEach((reasonSubTypeCode) => {
        const searchCode = `${reasonSubTypeCode.value.value},${reasonSubTypeCode.value.code}`;
        const responsibleFor = this.filteredCode('reason_responsible_for', searchCode);
        if (responsibleFor) {
          reasonSubTypeCode.value.responsible_for = responsibleFor.value;
        }
      });
    },
    init() {
      this.order_product_return.order_product_id = String(this.orderProduct.id);
      this.initCommonCodes();

      // init cancel price
      this.cancelProductPrice = this.orderProduct.product_discount_price ? this.orderProduct.product_discount_price : this.orderProduct.product_price;
      this.cancelDeliveryPrice = this.orderProduct.delivery_fee ? this.orderProduct.delivery_fee : 0;
    },
    cancelReturn() {
      this.$router.go(-1);
    },
    async requestReturn() {
      const that = this;
      const isEmptyList = [];

      if (!that.selectedReasonObject) isEmptyList.push('반품 사유');
      if (!that.order_product_return.reason) isEmptyList.push('반품 사유 내용');

      that.order_product_return.reason_sub_type = that.selectedReasonObject.code;
      if (that.selectedReasonObject.responsible_for === 'SELLER') {
        that.order_product_return.collect_fee_type = 'SELLER_DECIDES';
      }

      if (!that.order_product_return.collect_delivery_type) isEmptyList.push('반품 반송 방법');
      if (!that.order_product_return.collect_fee_type) isEmptyList.push('반품 배송비 지불 방법');

      if (isEmptyList.length === 0) {
        that.order_product_return.reason_sub_type = that.selectedReasonObject.code;
        if (that.selectedReasonObject.responsible_for === 'SELLER') {
          that.order_product_return.collect_fee_type = 'SELLER_DECIDES';
        }
        await that.$store.dispatch(`${prefix}/setOrderProductReturn`, that.order_product_return);
        if (that.result.result === 'success') {
          that.popupAlert('반품신청이 접수되었습니다.');
          that.$router.push({ name: 'mypage-order' });
        } else {
          that.popupAlert(that.result.message);
        }
      } else {
        that.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
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
    setReasonType() {
      if (this.selectedReasonObject.responsible_for === 'SELLER') {
        this.order_product_return.collect_fee_type = 'SELLER_DECIDES';
      } else {
        this.order_product_return.collect_fee_type = '';
      }
    },
  },
};
