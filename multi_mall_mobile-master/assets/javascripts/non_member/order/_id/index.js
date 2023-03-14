import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'non_member/order/_id';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    totalProductPrice: 0,
    totalProductDiscount: 0,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getOrder`, params.id);
    await store.dispatch('common/getCodes', ['order_status', 'order_sub_status']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      order: `${prefix}/order`,
      deliveryInfo: `${prefix}/deliveryInfo`,
      result: `${prefix}/result`,
    }),
    point() {
      if (this.order.total_point) return this.order.total_point;
      return 0;
    },
    coupon() {
      if (this.order.total_coupon_price) return this.order.total_coupon_price;
      return 0;
    },
  },
  created() {
    this.init();
  },
  methods: {
    initNullPointOrderList() {
      const stores = this.order.stores;
      const storesLength = stores.length;
      for (let storeIdx = 0; storeIdx < storesLength; storeIdx += 1) {
        const deliveryGroups = stores[storeIdx].delivery_groups;
        const deliveryGroupsLength = deliveryGroups.length;
        for (let deliveryGroupIdx = 0; deliveryGroupIdx < deliveryGroupsLength; deliveryGroupIdx += 1) {
          const orderProducts = deliveryGroups[deliveryGroupIdx].order_products;
          const orderProductsLength = orderProducts.length;
          for (let orderProductIdx = 0; orderProductIdx < orderProductsLength; orderProductIdx += 1) {
            if (!orderProducts[orderProductIdx].order_sub_status || orderProducts[orderProductIdx].order_sub_status === null) {
              orderProducts[orderProductIdx].order_sub_status = '';
              orderProducts[orderProductIdx].order_sub_status_str = '';
            }
          }
        }
      }
    },
    initPaidPrice() {
      const stores = this.order.stores;
      const storesLength = stores.length;
      let orderProductsLength = 0;
      let totalProductPrice = 0;
      let totalProductDiscount = 0;

      stores.forEach((store) => {
        store.delivery_groups.forEach((deliveryGroup) => {
          const orderProducts = deliveryGroup.order_products;
          orderProductsLength += orderProducts.length;
          orderProducts.forEach((product) => {
            totalProductPrice += (product.product_price * product.amount);
            totalProductPrice += product.option_price || product.option_price > 0 ? product.option_price * product.amount : 0;
            totalProductDiscount += product.product_discount_price || product.product_discount_price > 0 ? (product.product_price - product.product_discount_price) * product.amount : 0;
          });
        });
      });

      this.totalProductPrice = totalProductPrice;
      this.totalProductDiscount = totalProductDiscount;

      this.order.order_products_length = orderProductsLength;
      this.order.paidPriceRowspan = orderProductsLength + storesLength - 1;
    },
    init() {
      this.initNullPointOrderList();
      this.initPaidPrice();
    },
    async getOrderTable() {
      this.loading = true;
      const params = this.$route.params;
      await this.$store.dispatch(`${prefix}/getOrder`, params.id);
      this.init();
      this.loading = false;
    },
    async completePurchase(product) {
      const query = { ...this.$route.query };
      const params = { order_product_id: product.id };
      await this.$store.dispatch(`${prefix}/setDecidePurchase`, params);
      if (this.result.result === 'success') {
        this.popupAlert('구매확정 되었습니다.');
        await this.getOrderTable(query);
      } else this.popupAlert(this.result.message);
    },

    async showReason(orderProductId) {
      const res = await this.$store.dispatch(`${prefix}/getReason`, { order_product_id: orderProductId });
      if (!res.data.reason) return this.popupAlert('오류가 발생했습니다.');

      switch (res.data.reason.request.reason_type) {
        case 'RQST_CNCL':
          this.popupReqCancelEdit(orderProductId, res.data.reason);
          break;
        case 'RQST_EXCHNG':
          this.popupReqExchangeEdit(orderProductId, res.data.reason);
          break;
        case 'RQST_RTRN':
          this.popupReqReturnEdit(orderProductId, res.data.reason);
          break;
        case 'PSTPN_DLVRY': case 'PSTPN_CNCL': case 'PSTPN_EXCHNG': case 'PSTPN_RTRN':
          this.popupDelayReason(orderProductId, res.data.reason);
          break;
        default:
      }
    },
    async showDetail(orderProduct) {
      const claimOrderProduct = await this.$store.dispatch(`${prefix}/getExchangeReturnOrderDetail`, orderProduct.id);
      const res = await this.$store.dispatch(`${prefix}/getReason`, { order_product_id: orderProduct.id });
      if (!res.data.reason) return this.popupAlert('오류가 발생했습니다.');

      switch (res.data.reason.request.reason_type) {
        case 'RQST_CNCL':
          this.popupReqCancelDetail(orderProduct, res.data.reason);
          break;
        case 'RQST_EXCHNG':
          this.popupReqExchangeDetail(orderProduct, claimOrderProduct, res.data.reason);
          break;
        case 'RQST_RTRN':
          this.popupReqReturnDetail(orderProduct, claimOrderProduct, res.data.reason);
          break;
        default:
      }
    },
    /**
     * 사유보기 팝업
     */
    popupReqCancelEdit(orderProductId, cancelReason) {
      const that = this;
      const cancelReject = Object.prototype.hasOwnProperty.call(cancelReason, 'reject') ? cancelReason.reject : {};
      new Popup.RequestCancelEdit({
        propsData: {
          reason: cancelReason.request.reason,
          reason_sub_type: cancelReason.request.reason_sub_type,
          reject: cancelReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('취소사유 선택');
            if (!params.reason) isEmptyList.push('취소사유');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                await that.getOrderTable();
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqCancelDetail(orderProductId, cancelReason) {
      const cancelReject = Object.prototype.hasOwnProperty.call(cancelReason, 'reject') ? cancelReason.reject : {};
      new Popup.RequestCancelDetail({
        propsData: {
          reason: cancelReason.request.reason,
          reason_sub_type: cancelReason.request.reason_sub_type,
          reason_sub_type_str: cancelReason.request.reason_sub_type_str,
          reject: cancelReject,
        },
      }).$mount();
    },
    popupReqExchangeEdit(orderProductId, exchangeReason) {
      const that = this;
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestExchangeEdit({
        propsData: {
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reject: exchangeReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('교환사유 선택');
            if (!params.reason) isEmptyList.push('교환사유');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                await that.getOrderTable();
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqExchangeDetail(orderProduct, claimOrderProduct, exchangeReason) {
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestExchangeDetail({
        propsData: {
          order_product: orderProduct,
          claim_order_product: claimOrderProduct,
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reason_sub_type_str: exchangeReason.request.reason_sub_type_str,
          reason_responsible_for: exchangeReason.request.reason_responsible_for,
          reject: exchangeReject,
        },
      }).$mount();
    },
    popupReqReturnEdit(orderProductId, returnReason) {
      const that = this;
      const returnReject = Object.prototype.hasOwnProperty.call(returnReason, 'reject') ? returnReason.reject : {};
      new Popup.RequestReturnEdit({
        propsData: {
          reason: returnReason.request.reason,
          reason_sub_type: returnReason.request.reason_sub_type,
          reject: returnReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('반품사유 선택');
            if (!params.reason) isEmptyList.push('반품사유');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                await that.getOrderTable();
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqReturnDetail(orderProduct, claimOrderProduct, exchangeReason) {
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestReturnDetail({
        propsData: {
          order_product: orderProduct,
          claim_order_product: claimOrderProduct,
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reason_sub_type_str: exchangeReason.request.reason_sub_type_str,
          reason_responsible_for: exchangeReason.request.reason_responsible_for,
          reject: exchangeReject,
        },
      }).$mount();
    },
    popupDelayReason(orderProductId, delayReason) {
      new Popup.DelayReason({
        propsData: {
          reason: delayReason.request.reason,
          reason_sub_type: delayReason.request.reason_sub_type,
          reason_sub_type_str: delayReason.request.reason_sub_type_str,
        },
      }).$mount();
    },

    async popupDeliveryInquiry(info, store) {
      await this.$store.dispatch(`${prefix}/getDeliveryInfo`, info.id);

      const data = { deliveryInfo: this.deliveryInfo, product: info, store };
      if (Object.keys(this.deliveryInfo).length > 0) {
        new Popup.DeliveryInfo({
          propsData: {
            info: data,
            okCallback: (params) => params.$destroy(),
          },
        }).$mount();
      }
    },
    cancelRequestCancel(orderStatus, orderSubStatus, orderProductId) {
      const that = this;
      const data = { message: '', storePrefixPath: '', order_product_id: orderProductId };
      if (orderStatus === 'EXCHNG' && orderSubStatus === 'RQST_EXCHNG') {
        data.storePrefixPath = 'setCancelOrderProductExchange';
        data.message = '교환요청을 취소하시겠습니까?';
      }
      if (orderStatus === 'RTRN' && orderSubStatus === 'RQST_RTRN') {
        data.storePrefixPath = 'setCancelOrderProductReturn';
        data.message = '반품요청을 취소하시겠습니까?';
      }
      if (orderStatus === 'CNCL' && orderSubStatus === 'RQST_CNCL') {
        data.storePrefixPath = 'setCancelOrderProductCancel';
        data.message = '취소요청을 취소하시겠습니까?';
      }
      if (data.message) {
        new Popup.Confirm({
          propsData: {
            title: data.message,
            okCallback: async (params) => {
              await that.$store.dispatch(`${prefix}/${data.storePrefixPath}`, { order_product_id: orderProductId });
              if (that.result.result === 'success') {
                that.popupAlert('요청취소 되었습니다.');
                await that.getOrderTable();
              } else that.popupAlert(that.result.message);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert('이 주문건은 취소요청을 할 수 없습니다.');
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
