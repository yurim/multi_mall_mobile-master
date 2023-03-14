import Utils from '@/plugins/utils';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Loading,
  },
  created() {
  },
  async mounted() {
    const query = { ...this.$route.query };

    if (query.imp_success === 'true') {
      const orderNum = query.merchant_uid;
      Utils.removeCookie('option_compositions');
      Utils.removeCookie('unknown_carts');

      let endIntv = false;

      // 주문완료 확인
      const intv = setInterval(async () => {
        const res = await this.$store.dispatch('order/check_order_completed', { order_num: orderNum });
        if (res.data.result === 'success' && !endIntv) {
          endIntv = true;
          clearInterval(intv);

          // todo: tempOrder 가 없어서 페북 픽셀 연동 불가
          // if (window.facebookPixelId && window.fbq) {
          //   let numItems = 0;
          //   let value = 0;
          //   tempOrder.temp_order_products.forEach((op) => {
          //     numItems += parseInt(op.amount, 10);
          //     value += parseInt(op.product_total_price, 10);
          //   });
          //   window.fbq('track', 'Purchase', {
          //     content_type: 'product',
          //     content_ids: [this.product.id],
          //     currency: 'KRW',
          //     num_items: numItems,
          //     value,
          //   });
          // }

          this.$popup.showAlertPopup('주문이 완료되었습니다.');
          this.$router.replace(`/order/completed/${orderNum}`);
        }
      }, 200);
      setTimeout(() => {
        clearInterval(intv);
        this.$popup.showAlertPopup('결제에 실패하였습니다.');
        this.$router.replace('/order');
      }, 5 * 60 * 1000);
    } else {
      this.$popup.showAlertPopup('결제에 실패하였습니다.');
      this.$router.replace('/order');
    }
  },
};
