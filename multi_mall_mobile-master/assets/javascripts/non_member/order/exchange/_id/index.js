import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'non_member/order/exchange/_id';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    reasonSubTypeCodes: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
    selectedReasonObject: '',
    order_product_exchange: {
      order_product_id: '',
      reason_sub_type: '',
      reason: '',
      collect_delivery_type: '',
      collect_fee_type: '',
    },
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getClaimOrderProduct`, params.id);
    await store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type', 'reason_responsible_for']);
    await store.dispatch('common/getCodes', 'delivery_company');
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      codesValueArray: 'common/codesValueArray',
      filteredCode: 'common/filteredCode',
      orderProduct: `${prefix}/orderProduct`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    initCommonCodes() {
      this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_EXCHNG');
      this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
      this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'EXCHNG');
      this.reasonSubTypeCodes.forEach((reasonSubTypeCode) => {
        const searchCode = `${reasonSubTypeCode.value.value},${reasonSubTypeCode.value.code}`;
        const responsibleFor = this.filteredCode('reason_responsible_for', searchCode);
        if (responsibleFor) {
          reasonSubTypeCode.value.responsible_for = responsibleFor.value;
        }
      });
    },
    init() {
      this.order_product_exchange.order_product_id = String(this.orderProduct.id);
      this.initCommonCodes();
    },
    cancelExchange() {
      this.$router.push({ name: 'non_member-order' });
    },
    async requestExchange() {
      const that = this;
      const isEmptyList = [];

      if (!that.selectedReasonObject) isEmptyList.push('교환 사유');
      if (!that.order_product_exchange.reason) isEmptyList.push('교환 사유 내용');
      if (!that.order_product_exchange.collect_delivery_type) isEmptyList.push('교환 반송 방법');
      if (!that.order_product_exchange.collect_fee_type) isEmptyList.push('교환 배송비 지불 방법');

      if (isEmptyList.length === 0) {
        that.order_product_exchange.reason_sub_type = that.selectedReasonObject.code;
        if (that.selectedReasonObject.responsible_for === 'SELLER') {
          that.order_product_exchange.collect_fee_type = 'SELLER_DECIDES';
        }
        await that.$store.dispatch(`${prefix}/setOrderProductExchange`, that.order_product_exchange);
        if (that.result.result === 'success') {
          that.popupAlert('교환신청이 접수되었습니다.');
          that.$router.push({ name: 'non_member-order' });
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
        this.order_product_exchange.collect_fee_type = 'SELLER_DECIDES';
      } else {
        this.order_product_exchange.collect_fee_type = '';
      }
    },
  },
};
