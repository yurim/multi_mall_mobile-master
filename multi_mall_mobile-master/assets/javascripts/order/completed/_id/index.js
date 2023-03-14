import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import UserAuthMixin from '@/components/UserAuthMixin';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'order/completed/_id';

export default {
  mixins: [UserAuthMixin, SelperCommonMixin],
  data() {
    return {
    };
  },
  async fetch({ req, store, params }) {
    let cookie;
    if (process.server) cookie = req.headers.cookie;
    else cookie = document.cookie;

    const jwtNonMember = Utils.getCookie(cookie, 'jwtNonMember');
    const jwt = Utils.getCookie(cookie, 'jwt');
    if (jwtNonMember) { // todo: jwt 까서 expired 체크 해야됨
      // 비회원
      await store.commit(`${prefix}/setIsMember`, false);
      await store.dispatch(`${prefix}/getNonMemberOrder`, params.id);
    } else if (jwt) { // todo: jwt 까서 expired 체크 해야됨
      // 회원
      await store.commit(`${prefix}/setIsMember`, true);
      await store.dispatch(`${prefix}/getMemberOrder`, params.id);
    }
  },
  created() {
    if (process.client && !this.order) {
      this.$popup.showAlertPopup('회원 주문 조회 또는 비회원 주문 조회를 이용해주세요.');
      this.$router.replace('/user/login');
    }
  },
  mounted() {
    if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
      this.initSelper();
    }
  },
  computed: {
    ...mapGetters({
      isMember: `${prefix}/isMember`,
      order: `${prefix}/order`,
      orderProducts: `${prefix}/orderProducts`,
    }),
  },
  methods: {
    initSelper() {
      const intv = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (__trackSelperPurchase) {
          const __selperProductOrder = {};
          const __selperProductItems = {};
          const __tempSelperProductList = [];

          __selperProductOrder.__selperProductOrderNo = this.order.order_num;
          __selperProductOrder.__selperProductOrderTotalBasePrice = this.order.total_price;
          __selperProductOrder.__selperProductOrderTotalSalePrice = this.order.paid_price;
          __selperProductOrder.__selperEventType = 'Purchase';
          __selperProductOrder.__selperOSType = 'mobile';
          __selperProductOrder.__selperPlatform = process.env.SELPER_PLATFORM;

          this.orderProducts.forEach((orderProduct) => {
            const __selperProductItem = {};
            __selperProductItem.__selperProductItemId = orderProduct.product_id; // 상품아이디
            __selperProductItem.__selperProductItemBasePrice = orderProduct.option_price + orderProduct.product_price; // 상품가격
            __selperProductItem.__selperProductItemSalePrice = orderProduct.option_price
              + (orderProduct.product_discount_price ? orderProduct.product_discount_price : orderProduct.product_price); // 상품 판매가격
            __selperProductItem.__selperProductItemQuantity = orderProduct.amount;
            __selperProductItem.__selperProductItemCurrency = 'KRW';
            __selperProductItem.__selperProductItemShippingPrice = orderProduct.product_delivery_fee;
            __selperProductItem.__selperProductItemName = orderProduct.product_name;
            __selperProductItem.__selperProductItemBrand = orderProduct.store_name_kor; // 브랜드명
            __selperProductItem.__selperUserId = this.isLogin ? this.userId : null; // 유저아이디
            __tempSelperProductList.push(__selperProductItem);
          });

          __selperProductItems.__selperPlatform = process.env.SELPER_PLATFORM;
          __selperProductItems.products = __tempSelperProductList;
          // eslint-disable-next-line no-undef
          __trackSelperPurchase(__selperProductOrder, __selperProductItems);
          clearInterval(intv);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(intv);
      }, 5000);
    },
    parseSelperOptionNames(optionNamesStr) {
      const optionValues = [];
      const options = optionNamesStr.split(' / ');
      options.forEach((option) => {
        const optionNameAndValues = option.split(': ');
        const optionValue = optionNameAndValues[1] ? optionNameAndValues[1] : optionNameAndValues[0];
        optionValues.push(optionValue);
      });
      return optionValues.join(', ');
    },
  },
};
