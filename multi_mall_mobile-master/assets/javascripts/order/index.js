import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import DeliveryPrice from '@/plugins/deliveryPrice';
import Terms from '@/components/popups/PopTerms';
import UserAuthMixin from '@/components/UserAuthMixin';
import util from '@/assets/javascripts/util';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'order';

export default {
  mixins: [UserAuthMixin, SelperCommonMixin],
  data: () => ({
    storeGroupList: [],
    maxUsablePoint: 0,
    totalPriceInfo: {
      productPrice: 0,
      deliveryPrice: 0,
      salePrice: 0,
      pointSalePrice: 0,
      couponSalePrice: 0,
      totalPrice: 0,
      totalQuantity: 0,
      totalSavingPoint: 0,
    },
    termsAgree: {
      abroad: false,
      abroad2: false,
      privacy: false,
      terms: false,
      buyer: true,
    },
    paymentMethods: [],
    paymentMethod: null,
    delivery_message: '',
    clearanceNum: '',
    usingPoint: null,
    authNum: null,
    isPhoneAuth: false,
    isJeju: false,
    isCountryMountain: false,

    selectedDlvryMsg: '직접입력',
    deliveryMessageList: [
      '직접입력',
      '배송 전에 미리 연락 바랍니다.',
      '부재시 경비실에 맡겨 주세요.',
      '부재시 전화 주시거나 문자 남겨 주세요.',
    ],
    email: '',
    emailDomain: '',
    emailSelf: '',
    emailDomainList: [
      'naver.com',
      'gmail.com',
      'kakao.com',
      'nate.com',
      'hanmail.net',
      'hotmail.com',
      'yahoo.com',
    ],

    totalProductPrice: 0,
    totalProductDiscount: 0,
    balancePoint: 0,
    selectedDeliveryBtn: 'default',

    checkAbroadProduct: false,
  }),
  computed: {
    ...mapGetters({
      codeValueObjectArray: 'common/codeValueObjectArray',
      codesArray: 'common/codesArray',
      agreementObject: 'common/agreementObject',
      order_infos: `${prefix}/order_infos`,
      deliveries: `${prefix}/deliveries`,
      delivery: `${prefix}/delivery`,
      user: `${prefix}/user`,
      min_usable_point: `${prefix}/min_usable_point`,
    }),
  },
  watch: {
    'delivery.zipcode': async function deliveryZipcode(newVal) {
      if (newVal && newVal.length > 0) await this.changedZipcode(newVal);
    },
  },
  async fetch({ req, store }) {
    await store.commit(`${prefix}/clear`);
    await store.dispatch('common/getAgreements', ['terms', 'privacy']);
    let cookie;
    if (process.server) cookie = req.headers.cookie;
    else cookie = document.cookie;

    let optionCompositions = Utils.getCookie(cookie, 'option_compositions');
    if (optionCompositions) {
      optionCompositions = JSON.parse(optionCompositions);
      await store.dispatch(`${prefix}/get_order_infos`, {
        order_infos: optionCompositions,
      });

      const userId = Utils.getUserId(cookie);
      if (userId) {
        await store.dispatch(`${prefix}/get_deliveries`, {
          user_id: userId,
        });
      }
    }
  },
  async created() {
    // 필요한 공통 코드 가져오기
    await this.$store.dispatch('common/getCodesValue', [
      'payment_method',
    ]);

    // 결제 수단 가져오기
    this.paymentMethods = this.codeValueObjectArray('payment_method')
      .filter((v) => v.value === 'true')
      .sort((a, b) => a.order - b.order);
    if (this.paymentMethods.length > 0) this.paymentMethod = this.paymentMethods[0].code;
  },
  async mounted() {
    if (this.order_infos.length <= 0) {
      return this.$popup.showAlertPopup('주문 상품에 대한 정보가 존재하지 않습니다. 다시 시도해주세요.', () => {
        this.$router.replace('/main');
      });
    }

    if (this.user.email) {
      this.email = this.user.email.split('@')[0];
      const domain = this.user.email.split('@')[1];
      if (this.emailDomainList.indexOf(domain) > -1) {
        this.emailDomain = domain;
      } else {
        this.emailDomain = '';
        this.emailSelf = domain;
      }
    } else {
      this.emailDomain = this.emailDomainList[0];
    }

    // 기본 배송지가 도서산간인지 체크 및 알림 팝업
    if (this.delivery.zipcode) await this.changedZipcode(this.delivery.zipcode);

    this.initStoreGroupList();
    this.balancePoint = this.user.current_point;
    this.initCheckAbroad();
  },
  methods: {
    /**
     * 해외상품 존재 여부 체크
     */
    initCheckAbroad() {
      this.order_infos.forEach((v) => {
        if (v.product_info.is_abroad) this.checkAbroadProduct = true;
      });
      if (!this.checkAbroadProduct) {
        this.termsAgree.abroad = true;
        this.termsAgree.abroad2 = true;
      }
      if (this.checkAbroadProduct && this.user.clearance_num) {
        this.clearanceNum = this.user.clearance_num;
      }
    },
    initStoreGroupList() {
      if (this.order_infos) {
        this.storeGroupList = this.order_infos;
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'store_id');
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'delivery_group_id');
        this.storeGroupList = DeliveryPrice.groupBy(this.storeGroupList, 'product_id');
        this.refreshTotalPrice();
      }
    },
    refreshTotalPrice() {
      this.storeGroupList = DeliveryPrice.setDeliveryGroupPrices(this.storeGroupList, false, this.isJeju, this.isCountryMountain);
      this.setTotalPrice();
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
    setTotalPrice() {
      let totalProductPrice = 0;
      let totalDeliveryPrice = 0;
      let totalSalePrice = 0;
      let totalQuantity = 0;
      let totalSavingPoint = 0;
      const groupList = this.storeGroupList.flat(1);
      groupList.forEach((deliveryGroup) => {
        const firstCart = this.getFirstObject(deliveryGroup);
        const deliveryPrice = firstCart.deliveryPrice;
        const savingPoint = firstCart.savingPoint;

        deliveryGroup.forEach((productGroup) => {
          productGroup.forEach((product) => {
            const productInfo = product.product_info;
            totalProductPrice += (productInfo.price * product.amount);
            totalSalePrice += productInfo.discount_price || productInfo.product_discount_price > 0 ? (productInfo.price * product.amount) - (productInfo.discount_price * product.amount) : 0;
            if (product.option_info) {
              const optionInfo = product.option_info;
              totalProductPrice += optionInfo.additional_price || optionInfo.additional_price > 0 ? optionInfo.additional_price * product.amount : 0;
            }
            totalQuantity += product.amount;
          });
        });
        if (firstCart.delivery_info.fee_pay_method !== 'CSH_DLVRY') totalDeliveryPrice += deliveryPrice; // 선불 배송비 연산
        totalSavingPoint += savingPoint;
      });

      this.totalPriceInfo.productPrice = totalProductPrice;
      this.totalPriceInfo.deliveryPrice = totalDeliveryPrice;
      this.totalPriceInfo.salePrice = totalSalePrice;
      this.totalPriceInfo.totalPrice = totalProductPrice + totalDeliveryPrice - totalSalePrice - this.totalPriceInfo.pointSalePrice;
      this.totalPriceInfo.totalQuantity = totalQuantity;
      this.totalPriceInfo.totalSavingPoint = totalSavingPoint;

      this.maxUsablePoint = Math.ceil((totalProductPrice + totalDeliveryPrice) * 0.1);

      this.setBalancePoint();
      if (this.totalPriceInfo.pointSalePrice > 0 && this.totalPriceInfo.totalPrice < 0) {
        this.$popup.showAlertPopup('사용 포인트 금액은 상품 금액을 초과할 수 없습니다.');
        this.totalPriceInfo.pointSalePrice = 0;
        this.setTotalPrice();
      }
    },
    async checkReceiver(event) {
      const checked = event.target.checked;
      if (checked) {
        this.selectedDeliveryBtn = 'new';
        await this.$store.commit(`${prefix}/setDelivery`, {
          receiver_name: this.user.name,
          phone: this.user.phone,
          phone2: this.delivery.phone2,
          zipcode: this.delivery.zipcode,
          address: this.delivery.address,
          detail_address: this.delivery.detail_address,
        });
      }
    },
    popAddressList() {
      new this.$popup.DeliveryAddressList({
        propsData: {
          userId: this.userId,
          deliveries: this.deliveries,
          okCallback: async (params) => {
            this.$store.commit(`${prefix}/setDelivery`, params.delivery);
          },
        },
      }).$mount();
    },
    searchAddress(targetEleId) {
      util.showSearchAddress(targetEleId, (data) => {
        this.$set(this.delivery, 'zipcode', data.zonecode);
        this.$set(this.delivery, 'address', data.address);
        this.$set(this.delivery, 'detail_address', '');
      });
    },
    closeSearchAddress(targetEleId) {
      util.closeSearchAddress(targetEleId);
    },
    async changedZipcode(zipcode) {
      const res = await this.$axios.get('common/get_cma', { params: { zipcode } });
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      const cma = res.data.data.cma;

      if (cma.is_jeju || cma.is_country_mountain) {
        this.isJeju = cma.is_jeju;
        this.isCountryMountain = cma.is_country_mountain;
        this.$popup.showAlertPopup('제주 또는 도서산간 지역은 추가 배송비가 부과될 수 있습니다.');
      } else {
        this.isJeju = false;
        this.isCountryMountain = false;
      }
      this.refreshTotalPrice();
    },
    selectedDeliveryBtnClass(target) {
      if (this.selectedDeliveryBtn === target) {
        return 'full_light_but';
      }
      return 'gray_but_light';
    },
    defaultDelivery() {
      this.selectedDeliveryBtn = 'default';
      const delivery = this.deliveries.find((v) => v.is_default);
      if (delivery) this.$store.commit(`${prefix}/setDelivery`, delivery);
    },
    newDelivery() {
      this.selectedDeliveryBtn = 'new';
      this.$store.commit(`${prefix}/setDelivery`, {});
    },
    useAllPoint() {
      if (this.user.current_point > this.maxUsablePoint) {
        this.totalPriceInfo.pointSalePrice = this.maxUsablePoint;
      } else {
        this.totalPriceInfo.pointSalePrice = this.user.current_point;
      }
      this.setTotalPrice();
    },
    changeUsingPoint(event) {
      if (this.user.current_point < event.target.value) {
        this.$popup.showAlertPopup('보유 금액 이상 사용은 불가능 합니다.');
        this.totalPriceInfo.pointSalePrice = 0;
        event.target.blur();
      }
      if (!event.target.value) {
        this.totalPriceInfo.pointSalePrice = 0;
      }
      this.setTotalPrice();
    },
    setBalancePoint() {
      if (this.user.current_point >= this.totalPriceInfo.pointSalePrice) {
        this.balancePoint = this.user.current_point - this.totalPriceInfo.pointSalePrice;
      } else {
        this.balancePoint = this.user.current_point;
      }
    },
    focusoutPoint() {
      this.totalPriceInfo.pointSalePrice = parseInt(this.totalPriceInfo.pointSalePrice, 10);
      const point = this.totalPriceInfo.pointSalePrice;
      if (point === 0) return;

      if (this.maxUsablePoint < point) {
        this.$popup.showAlertPopup('결제 금액의 10% 까지만 포인트를 사용할 수 있습니다.');
        this.totalPriceInfo.pointSalePrice = this.maxUsablePoint;
      }

      this.setTotalPrice();
    },
    async sendSms() {
      if (this.isPhoneAuth) return this.$popup.showAlertPopup('이미 인증되었습니다.');
      if (this.user.phone) {
        const res = await this.$store.dispatch(`${prefix}/send_sms`, {
          phone: this.user.phone,
        });
        if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
        this.$refs.send_sms.classList.add('display_none');
        this.$refs.edit_phone.classList.remove('display_none');
        this.$refs.phone.disabled = true;
        let classNames = this.$refs.auth_num_wrap.className;
        classNames = classNames.replace(/display_none/gi, '');
        this.$refs.auth_num_wrap.className = classNames;
        this.$popup.showAlertPopup('인증번호가 발송되었습니다.');
      } else {
        this.$popup.showAlertPopup('전화번호를 입력해주세요.');
      }
    },
    async checkSms() {
      if (this.isPhoneAuth) return;
      const res = await this.$store.dispatch(`${prefix}/check_sms`, {
        phone: this.user.phone,
        auth_num: this.authNum,
      });
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      this.isPhoneAuth = true;
      let classNames = this.$refs.auth_num_wrap.className;
      classNames += ' display_none';
      this.$refs.auth_num_wrap.className = classNames;
      this.$popup.showAlertPopup('인증되었습니다.');
    },
    async editPhone() {
      this.$refs.send_sms.classList.remove('display_none');
      this.$refs.edit_phone.classList.add('display_none');
      this.$refs.auth_num_wrap.classList.add('display_none');
      this.$refs.phone.disabled = false;

      this.isPhoneAuth = false;
    },
    agreeAllTerms(event) {
      this.termsAgree.privacy = event.target.checked;
      this.termsAgree.terms = event.target.checked;
    },
    makeTempOrderData() {
      const tempOrderData = {};

      if (this.userId && this.userGrade === 0) tempOrderData.user_id = this.userId;
      tempOrderData.name = this.user.name;
      if (this.emailDomain) tempOrderData.email = `${this.email}@${this.emailDomain}`;
      else tempOrderData.email = `${this.email}@${this.emailSelf}`;
      tempOrderData.phone = this.user.phone;
      tempOrderData.receiver_name = this.delivery.receiver_name;
      tempOrderData.delivery_name = this.delivery.address_name;
      tempOrderData.delivery_phone = this.delivery.phone;
      tempOrderData.delivery_phone2 = this.delivery.phone2;
      tempOrderData.delivery_zipcode = this.delivery.zipcode;
      tempOrderData.delivery_address = this.delivery.address;
      tempOrderData.delivery_detail_address = this.delivery.detail_address;
      tempOrderData.delivery_message = this.delivery_message;
      tempOrderData.total_price = this.totalPriceInfo.productPrice;
      tempOrderData.total_delivery_fee = this.totalPriceInfo.deliveryPrice;
      tempOrderData.total_point = parseInt(this.totalPriceInfo.pointSalePrice, 10);
      tempOrderData.total_coupon_price = this.totalPriceInfo.couponSalePrice;
      tempOrderData.clearance_num = this.clearanceNum;
      tempOrderData.paid_price = this.totalPriceInfo.totalPrice;
      tempOrderData.total_save_point = this.totalPriceInfo.totalSavingPoint;
      tempOrderData.channel = 'MOBILE'; // pc or mobile
      tempOrderData.payment_method = this.paymentMethod;
      tempOrderData.temp_order_products = [];
      this.storeGroupList.flat(Infinity).forEach((cart) => {
        let productPrice = cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price;
        productPrice += cart.option_info.additional_price;
        const productTotalPrice = productPrice * cart.amount;
        const tempOrderProduct = {
          store_id: cart.store_id,
          product_id: cart.product_id,
          option_composition_id: cart.option_composition_id,
          amount: cart.amount,
          saving_type: cart.product_info.saving_type,
          saving_rate: cart.product_info.saving_rate ? cart.product_info.saving_rate : null,
          is_abroad: cart.product_info.is_abroad,
          product_name: cart.product_info.name,
          product_price: cart.product_info.price,
          option_price: cart.option_info.additional_price,
          product_total_price: productTotalPrice,
          product_option_names: cart.option_info.option_str_list.join(' / '),
          save_point: Math.floor((productTotalPrice * cart.product_info.saving_rate) / 100),
        };
        if (cart.delivery_group_id) tempOrderProduct.delivery_group_id = cart.delivery_group_id;
        if (cart.product_info.discount_price) tempOrderProduct.product_discount_price = cart.product_info.discount_price;
        tempOrderData.temp_order_products.push(tempOrderProduct);
      });
      tempOrderData.title = tempOrderData.temp_order_products[0].product_name;
      if (tempOrderData.temp_order_products.length > 1) {
        tempOrderData.title += ` 외 ${tempOrderData.temp_order_products.length - 1}건`;
      }

      return tempOrderData;
    },
    checkOrderData(tempOrderData) {
      if (!tempOrderData.name) return '주문자 이름을 입력해주세요';
      if (!tempOrderData.email) return '주문자 이메일을 입력해주세요';
      if (!tempOrderData.phone) return '주문자 휴대폰 번호를 입력해주세요';
      if (!this.userId && !this.isPhoneAuth) return '휴대폰 번호를 인증해주세요.';
      if (this.userId && this.userGrade === 0 && !tempOrderData.delivery_name) return '배송지 이름을 입력해주세요';
      if (!tempOrderData.receiver_name) return '수령인 이름을 입력해주세요';
      if (!tempOrderData.delivery_phone) return '수령인 휴대폰 번호를 입력해주세요';
      if (!tempOrderData.delivery_zipcode) return '수령인 우편번호를 입력해주세요';
      if (!tempOrderData.delivery_address) return '수령인 주소를 입력해주세요';
      if (!tempOrderData.delivery_detail_address) return '수령인 상세주소를 입력해주세요';
      if (this.checkAbroadProduct) {
        if (!tempOrderData.clearance_num) return '개인통관고유부호를 입력해주세요';
        const regex = /\bp\d{12}\b/i;
        if (!regex.test(tempOrderData.clearance_num)) return '개인통관고유부호 형식이 올바르지 않습니다.';
      }
      if (Object.values(this.termsAgree).filter((v) => !v).length > 0) return '필수 약관에 모두 동의 해야만합니다.';
    },
    popTerms(agreementType, agreementTypeStr) {
      new Terms({
        propsData: {
          title: agreementTypeStr,
          message: this.agreementObject(agreementType).content,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    async makePayment() {
      const tempOrderData = this.makeTempOrderData();

      const inValidMessage = this.checkOrderData(tempOrderData);
      if (inValidMessage) return this.$popup.showAlertPopup(inValidMessage);

      const res = await this.$store.dispatch(`${prefix}/create_temp_order`, tempOrderData);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      await this.requestPay(res.data.data.temp_order);
    },
    async requestPay(tempOrder) {
      // todo: pg 분리 필요
      const payData = {
        pg: 'uplus.im_ilsarmh11S',
        escrow: true,
        pay_method: this.paymentMethod.toLowerCase(),
        merchant_uid: tempOrder.order_num,
        name: tempOrder.title,
        amount: tempOrder.paid_price,
        buyer_email: tempOrder.email,
        buyer_name: tempOrder.name,
        buyer_tel: tempOrder.phone,
        buyer_addr: tempOrder.delivery_address,
        buyer_postcode: tempOrder.delivery_zipcode,
        notice_url: `${process.env.BASE_URL}/order/iamport_webhook`,
        m_redirect_url: `${window.location.host}/order/payment_callback`, // 모바일 콜백
      };

      if (payData.pg === 'kcp') {
        payData.kcpProducts = tempOrder.temp_order_products.map((v) => ({
          orderNumber: v.order_num,
          name: v.product_name,
          quantity: v.amount,
          amount: v.product_price,
        }));
      }
      this.$IMP().request_pay(payData);
    },
    selectDlvryMsg() {
      const selectedDlvryMsg = this.selectedDlvryMsg;
      let message = '';
      if (selectedDlvryMsg !== '직접입력') message = selectedDlvryMsg;
      this.delivery_message = message;
    },
  },
};
