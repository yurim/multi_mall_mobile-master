import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import DeliveryPrice from '@/plugins/deliveryPrice';
import UserAuthMixin from '@/components/UserAuthMixin';
import SelperCommonMixin from '@/components/SelperCommonMixin';
import _ from 'lodash';

const prefix = 'cart';

export default {
  mixins: [UserAuthMixin, SelperCommonMixin],
  data: () => ({
    storeGroupList: [],
    totalPriceInfo: {
      productPrice: 0,
      deliveryPrice: 0,
      salePrice: 0,
      pointSalePrice: 0,
      couponSalePrice: 0,
      totalPrice: 0,
      totalQuantity: 0,
    },
  }),
  async fetch({ req, store }) {
    let cookie;
    if (process.server) cookie = req.headers.cookie;
    else cookie = document.cookie;

    const userId = await Utils.getUserId(cookie);
    if (userId) {
      await store.dispatch(`${prefix}/get_carts`, { user_id: userId });
    } else {
      let unknownCartsStr = await Utils.getCookie(cookie, 'unknown_carts');
      if (unknownCartsStr) {
        unknownCartsStr = decodeURIComponent(unknownCartsStr);
        const unknownCarts = JSON.parse(unknownCartsStr);
        if (unknownCarts.length > 0) {
          await store.dispatch(`${prefix}/get_unknown_carts`, { unknown_carts: unknownCarts });
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      carts: `${prefix}/carts`,
    }),
  },
  async created() {
    this.initStoreGroupList();
  },
  mounted() {
    if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
      this.initSelper();
    }

    this.initNaverPayBtn();
  },
  methods: {
    initSelper() {
      const intv = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (__trackSelperAddToCart) {
          const __selperProductItems = {};
          const __tempSelperProductList = [];
          this.carts.forEach((cart) => {
            const __selperProductItem = {};
            __selperProductItem.__selperProductItemId = cart.product_id; // 상품아이디
            __selperProductItem.__selperProductItemBasePrice = cart.option_info.additional_price + cart.product_info.price; // 상품가격
            __selperProductItem.__selperProductItemSalePrice = cart.option_info.additional_price
              + (cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price); // 상품 판매가격
            __selperProductItem.__selperProductItemQuantity = cart.amount; // 구매상품수량
            __selperProductItem.__selperProductItemCurrency = 'KRW'; // 화폐단위
            __selperProductItem.__selperProductItemName = cart.product_info.name; // 상품명
            __selperProductItem.__selperProductItemBrand = cart.store.name_kor; // 브랜드명
            __selperProductItem.__selperEventType = 'AddToCart';
            __selperProductItem.__selperOSType = 'mobile';
            __selperProductItem.__selperPlatform = process.env.SELPER_PLATFORM;
            __tempSelperProductList.push(__selperProductItem);
          });
          __selperProductItems.__selperPlatform = process.env.SELPER_PLATFORM;
          __selperProductItems.products = __tempSelperProductList;
          // eslint-disable-next-line no-undef
          __trackSelperAddToCart(__selperProductItems);
          clearInterval(intv);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(intv);
      }, 5000);
    },
    async refresh() {
      if (!this.isNormalUser) await this.checkUnknownCarts();
      else await this.$store.dispatch(`${prefix}/get_carts`);
      this.initStoreGroupList();
    },
    async checkUnknownCarts() {
      // 비회원 장바구니 가져오기
      if (typeof document !== 'undefined') {
        let unknownCartsStr = await Utils.getCookie(document.cookie, 'unknown_carts');
        if (unknownCartsStr) {
          unknownCartsStr = decodeURIComponent(unknownCartsStr);
          const unknownCarts = JSON.parse(unknownCartsStr);
          if (unknownCarts.length > 0) {
            await this.$store.dispatch(`${prefix}/get_unknown_carts`, { unknown_carts: unknownCarts });
          } else {
            await this.$store.commit(`${prefix}/setCarts`, []);
          }
        }
      }
    },
    initStoreGroupList() {
      if (this.carts) {
        this.setCartsChecked(this.carts, true);

        this.storeGroupList = this.carts;
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'store_id');
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'delivery_group_id');
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'product_id');
        this.refreshTotalPrice();
      }
    },
    getProductPrice(cart) {
      return DeliveryPrice.getProductPrice(cart);
    },
    getFirstObject(group) {
      let result;
      if (Array.isArray(group)) {
        const flatList = group.flat(Infinity);
        if (flatList.length > 0) result = flatList[0];
      } else {
        result = group;
      }

      return result;
    },
    async deleteCarts(cartIds) {
      await this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefix}/delete_cart`, {
          cart_ids: cartIds,
        });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
      });
      await this.finishCartDelete();
    },
    async finishCartDelete() {
      this.$popup.showAlertPopup('삭제되었습니다.');
      await this.refresh();
    },
    // 장바구니 아이템 삭제
    showDeleteCartsPopup(message, carts) {
      new this.$popup.Confirm({
        propsData: {
          title: message,
          okCallback: async (params) => {
            params.$destroy();
            if (!this.isNormalUser) {
              const compositionIds = carts.map((v) => v.option_composition_id);
              const newCarts = this.storeGroupList.flat(Infinity).filter((cart) => !compositionIds.includes(cart.option_composition_id));
              const cookieCarts = [];
              newCarts.forEach((v) => {
                cookieCarts.push({
                  product_id: v.product_id,
                  option_composition_id: v.option_composition_id,
                  amount: v.amount,
                  store_id: v.store_id,
                });
              });
              await Utils.addCookie('unknown_carts', JSON.stringify(cookieCarts));
              await this.finishCartDelete();
            } else {
              await this.deleteCarts(carts.map((v) => v.id));
            }
          },
        },
      }).$mount();
    },
    async deleteCart(group) {
      const message = '해당 상품을 장바구니에서 삭제하시겠습니까?';
      let carts;
      if (Array.isArray(group)) carts = group.flat(Infinity);
      else carts = [group];
      await this.showDeleteCartsPopup(message, carts);
    },
    async deleteAllCarts() {
      const message = '장바구니의 모든 상품을 삭제하시겠습니까?';
      await this.showDeleteCartsPopup(message, this.storeGroupList.flat(Infinity));
    },
    async deleteSelectedCarts() {
      const message = '선택된 상품들을 삭제하시겠습니까?';
      const carts = this.storeGroupList.flat(Infinity).filter((v) => v.isChecked);
      if (carts.length <= 0) return this.$popup.showAlertPopup('하나 이상의 상품을 선택해주세요.');
      await this.showDeleteCartsPopup(message, carts);
    },
    async checkProducts(carts) {
      return await this.$store.dispatch(`${prefix}/check_products`, {
        option_composition_ids: carts.map((v) => v.option_composition_id),
      });
    },
    async selectedCartsBuy() {
      const selectedCarts = this.storeGroupList.flat(Infinity).filter((v) => v.isChecked);
      await this.showBuyPopup('선택된 상품들을 주문 하시겠습니까?', selectedCarts);
    },
    async allCartsBuy() {
      const carts = this.storeGroupList.flat(Infinity).filter((v) => v.amount > 0);
      await this.showBuyPopup('전체 상품을 주문 하시겠습니까?', carts);
    },
    async showBuyPopup(message, carts) {
      if (carts.length <= 0) return this.$popup.showAlertPopup('하나 이상의 상품을 선택해주세요.');

      const res = await this.checkProducts(carts);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      new this.$popup.Confirm({
        propsData: {
          title: message,
          okCallback: async (params) => {
            const optionCompositions = carts
              .map((v) => Object.assign(v.option_info, { amount: v.amount, store_id: v.store_id }))
              .map((v) => ({
                id: v.id,
                product_id: v.product_id,
                amount: v.amount,
                store_id: v.store_id,
              }));
            await Utils.addCookie('option_compositions', JSON.stringify(optionCompositions), 1000 * 60 * 60 * 2);
            params.$destroy();
            await this.$router.push('/order');
          },
        },
      }).$mount();
    },
    setTotalPrice() {
      let totalProductPrice = 0;
      let totalDeliveryPrice = 0;
      let totalSalePrice = 0;
      let totalQuantity = 0;
      const groupList = this.storeGroupList.flat(1);
      groupList.forEach((deliveryGroup) => {
        const firstCart = this.getFirstObject(deliveryGroup);
        const deliveryPrice = firstCart.deliveryPrice;
        let isCheckedByGroup = false;

        deliveryGroup.forEach((productGroup) => {
          productGroup.forEach((product) => {
            if (product.isChecked) {
              const productInfo = product.product_info;
              totalProductPrice += (productInfo.price * product.amount);
              totalSalePrice += productInfo.discount_price || productInfo.product_discount_price > 0 ? (productInfo.price * product.amount) - (productInfo.discount_price * product.amount) : 0;
              if (product.option_info) {
                const optionInfo = product.option_info;
                totalProductPrice += optionInfo.additional_price || optionInfo.additional_price > 0 ? optionInfo.additional_price * product.amount : 0;
              }
              totalQuantity += product.amount;
              isCheckedByGroup = true;
            }
          });
        });
        if (isCheckedByGroup && firstCart.delivery_info.fee_pay_method !== 'CSH_DLVRY') totalDeliveryPrice += deliveryPrice;
      });

      this.totalPriceInfo.productPrice = totalProductPrice;
      this.totalPriceInfo.deliveryPrice = totalDeliveryPrice;
      this.totalPriceInfo.salePrice = totalSalePrice;
      this.totalPriceInfo.totalPrice = totalProductPrice + totalDeliveryPrice - totalSalePrice;
      this.totalPriceInfo.totalQuantity = totalQuantity;
    },
    async updateAmount(cart, change) {
      if (!this.isValidProduct(cart)) return;
      let afterAmount = cart.amount + change;
      if (afterAmount < 1) {
        afterAmount = 1;
      }
      const isChanged = (cart.amount !== afterAmount);
      cart.amount = afterAmount;
      if (isChanged) {
        if (this.isLogin) { // 수량 변경 저장
          this.$store.dispatch(`${prefix}/update_cart`, cart);
        } else {
          let unknownCarts = [];
          let unknownCartsStr = Utils.getCookie(document.cookie, 'unknown_carts');
          if (unknownCartsStr) {
            unknownCartsStr = decodeURIComponent(unknownCartsStr);
            unknownCarts = JSON.parse(unknownCartsStr);
          }
          const originCart = _.find(unknownCarts, { product_id: cart.product_id, option_composition_id: cart.option_composition_id });
          originCart.amount = cart.amount;
          const newUnknownCartsStr = JSON.stringify(unknownCarts);
          await Utils.addCookie('unknown_carts', newUnknownCartsStr);
        }
      }
      this.refreshTotalPrice();
    },
    toggleChecked(group) {
      const cartList = group.flat(Infinity);
      cartList.forEach((cart) => {
        cart.isChecked = !cart.isChecked;
      });
      this.refreshTotalPrice();
    },
    refreshTotalPrice() {
      this.storeGroupList = DeliveryPrice.setDeliveryGroupPrices(this.storeGroupList, true);
      this.setTotalPrice();
    },
    setCartsChecked(carts, checked) {
      carts.forEach((v) => {
        if (this.isValidProduct(v)) {
          v.isChecked = checked;
        } else {
          v.amount = 0;
        }
      });
    },
    checkAll() {
      const carts = this.storeGroupList.flat(Infinity);
      const checked = carts.filter((v) => v.isChecked).length !== carts.length;
      this.setCartsChecked(carts, checked);
      this.refreshTotalPrice();
    },
    isValidProduct(cart) {
      return (cart.product_info.is_sale && cart.product_info.is_listed && !cart.product_info.is_blocked) && !this.isOutOfStock(cart);
    },
    isOutOfStock(cart) {
      return cart.option_info.is_inventory_managed
        && cart.option_info.inventory_amount <= 0;
    },
    moveProductDetail(productGroup) {
      const productInfo = productGroup.product_info;
      if (!productInfo.is_listed || productInfo.is_blocked) {
        return this.$popup.showAlertPopup('판매중지된 상품입니다.');
      }
      this.$router.push(`/product/${productGroup.product_id}`);
    },
    initNaverPayBtn() {
      // eslint-disable-next-line no-undef
      naver.NaverPayButton.apply({
        BUTTON_KEY: process.env.NAVER_BUTTON_KEY,
        TYPE: 'C',
        COLOR: 1,
        COUNT: 1,
        ENABLE: 'Y',
        EMBED_ID: 'naverPayWrap',
        BUY_BUTTON_HANDLER: this.naverPayBtn,
      });
    },
    async naverPayBtn() {
      const selectedCarts = this.storeGroupList.flat(Infinity).filter((v) => v.isChecked);
      if (selectedCarts.length <= 0) return this.$popup.showAlertPopup('하나 이상의 상품을 선택해주세요.');

      new this.$popup.Confirm({
        propsData: {
          title: '선택된 상품들을 네이버페이로 주문 하시겠습니까?',
          okCallback: async ({ $destroy }) => {
            $destroy();
            await this.naverPayBuy(selectedCarts);
          },
        },
      }).$mount();
    },
    async naverPayBuy(carts) {
      // 상품 데이터 체크
      let res = await this.checkProducts(carts);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      // 네이버페이 temp_order 생성
      res = await this.$store.dispatch('order/create_naver_temp_order', {
        user_id: (this.userId && this.userGrade === 0) ? this.userId : null,
        channel: 'MOBILE',
        carts: carts.map((v) => ({
          product_id: v.product_id,
          option_composition_id: v.option_composition_id,
          amount: v.amount,
        })),
      });
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      if (!res.data.data.naver_products || !res.data.data.temp_order) return this.$popup.showAlertPopup('주문정보가 올바르지 않습니다.');

      const tempOrder = res.data.data.temp_order;
      const naverProducts = res.data.data.naver_products;
      naverProducts.forEach((product) => {
        product.infoUrl = `${window.location.origin}/product/${product.id}`;
      });

      if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
        await this.npayPurchaseSelper(tempOrder);
      }

      // 네이버페이 결제 요청
      this.$IMP().request_pay({
        pg: `naverco.${process.env.NAVER_CENTER_ID}`,
        merchant_uid: tempOrder.order_num,
        name: tempOrder.title,
        amount: tempOrder.total_price,
        naverProducts,
        naverInterface: {
          cpaInflowCode: Utils.getCookie(document.cookie, 'CPAValidator'),
          naverInflowCode: Utils.getCookie(document.cookie, 'NA_CO'),
          saClickId: Utils.getCookie(document.cookie, 'NVADID'),
        },
        notice_url: `${process.env.BASE_URL}/order/iamport_webhook`,
      }, (suc) => {
        console.log('suc!', suc);
      }, (error) => {
        console.log('error!', error);
      });

      if (window.facebookPixelId && window.fbq) {
        let numItems = 0;
        let value = 0;
        const productIds = [];
        this.carts.forEach((cart) => {
          productIds.push(cart.product_id);
          numItems += parseInt(cart.amount, 10);
          value += parseInt(cart.option_info.additional_price + (cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price), 10);
        });
        window.fbq('track', 'Purchase', {
          content_type: 'product',
          content_ids: productIds,
          currency: 'KRW',
          num_items: numItems,
          value,
        });
      }
    },
    npayPurchaseSelper(tempOrder) {
      const __selperProductOrder = {};
      const __selperProductItems = {};
      const __tempSelperProductList = [];

      __selperProductOrder.__selperProductOrderTotalBasePrice = this.totalPriceInfo.productPrice; // 주문금액
      __selperProductOrder.__selperProductOrderTotalSalePrice = this.totalPriceInfo.totalPrice; // 결제금액
      __selperProductOrder.__selperProductOrderNo = tempOrder.order_num; // 주문번호
      __selperProductOrder.__selperEventType = 'NpayPurchase';
      __selperProductOrder.__selperOSType = 'mobile';
      __selperProductOrder.__selperPlatform = process.env.SELPER_PLATFORM;

      this.carts.forEach((cart) => {
        const __selperProductItem = {};
        __selperProductItem.__selperProductItemId = cart.product_id; // 상품아이디
        __selperProductItem.__selperProductItemName = cart.product_info.name; // 상품명
        __selperProductItem.__selperProductItemBasePrice = cart.option_info.additional_price + cart.product_info.price; // 상품가격
        __selperProductItem.__selperProductItemSalePrice = cart.option_info.additional_price
          + (cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price); // 상품 판매가격
        __selperProductItem.__selperProductItemShippingPrice = cart.option_info.additional_price
          + (cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price); // 배송비
        __selperProductItem.__selperProductItemQuantity = cart.amount; // 상품수량
        __selperProductItem.__selperProductItemCurrency = 'KRW'; // 상품화폐단위
        __selperProductItem.__selperProductItemBrand = cart.store.name_kor; // 브랜드명
        __selperProductItem.__selperUserId = this.isLogin ? this.userId : null; // 유저아이디
        __tempSelperProductList.push(__selperProductItem);
      });

      __selperProductItems.__selperPlatform = process.env.SELPER_PLATFORM;
      __selperProductItems.products = __tempSelperProductList;
      // eslint-disable-next-line no-undef
      __trackSelperPurchase(__selperProductOrder, __selperProductItems);
    },
  },
};
