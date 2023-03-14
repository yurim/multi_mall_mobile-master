import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import Utils from '@/plugins/utils';
import RecentProductsMixin from '@/components/RecentProductsMixin';
import UserAuthMixin from '@/components/UserAuthMixin';
import jsUtil from '@/assets/javascripts/util';

import _ from 'lodash';
import fp from 'lodash/fp';
import SelperCommonMixin from '@/components/SelperCommonMixin';
import StickyMixin from '@/components/StickyMixin';

const prefix = 'product/_id';
const prefixReview = 'product/review';
const prefixQuestion = 'product/question';
const prefixCart = 'cart';

const OPTION_TYPE_STDALN = 'STDALN'; // 단독
const OPTION_TYPE_ASSCTN = 'ASSCTN'; // 조합

const MAX_COOKIE_BYTE = 4096;

export default {
  mixins: [StickyMixin, RecentProductsMixin, UserAuthMixin, SelperCommonMixin],
  head() {
    const metaTags = [
      { property: 'og:title', content: this.product.name },
      { property: 'og:image', content: this.product.main_image, hid: 'og:image' },
      { property: 'og:url', content: `https://molly.kr/product/${this.product.id}` },
      { property: 'product:brand', content: 'Molly' },
      { property: 'product:condition', content: 'new' },
      { property: 'product:price:amount', content: this.product.price },
      { property: 'product:price:currency', content: 'KRW' },
      { property: 'product:retailer_item_id', content: this.product.id },
    ];

    if (this.product.is_sale) metaTags.push({ property: 'product:availability', content: 'in stock' });
    else metaTags.push({ property: 'product:availability', content: 'out of stock' });

    if (this.product.category_list && this.product.category_list.length > 0) {
      metaTags.push({ property: 'og:description', content: this.product.category_list[this.product.category_list.length - 1].name });
      metaTags.push({ property: 'product:item_group_id', content: this.product.category_list[this.product.category_list.length - 1]._id });
    }

    if (this.product.discount_price) {
      metaTags.push({ property: 'product:sale_price:amount', content: this.product.discount_price });
      metaTags.push({ property: 'product:sale_price:currency', content: 'KRW' });
    }

    return {
      meta: metaTags,
    };
  },
  data() {
    return {
      selperPlatform: process.env.SELPER_PLATFORM,
      // sticky
      sticky: {
        targetId: 'stickyNav',
        className: 'sticky_fix',
        startHeight: 60,
      },

      swiperOptionTop: {
        loop: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      swiperOptionThumbs: {
        loop: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
      },
      showShareWrap: false,

      // option
      options: [],
      selectedOptionCompositions: [],
      selectedTotalAmount: 0,
      selectedTotalPrice: 0,

      // test
      selectedOptionValues: [],

      // non member buy agreements
      nonMemberBuyAgreements: {},

      // option image hover
      optionPreviewImage: '',

      // abroadNoticeTopOn: false,
      // abroadNoticeBottomOn: false,
      // productNoticeOn: false,
      productReviewOn: true,
      productQuestionOn: false,
      // deliveryNoticeOn: false,
      exchangeReturnNoticeOn: false,

      // fixed total count
      fixedReviewTotalCount: 0,
      fixedQuestionTotalCount: 0,

      // buy button
      onByeWrap: false,
      bodyTag: null,

      sale_type: null,
    };
  },
  async fetch({ store, params }) {
    // product
    await store.dispatch(`${prefix}/getProduct`, params.id);

    // review
    const data = { id: params.id };
    await store.dispatch(`${prefixReview}/getReviews`, data);
    await store.commit(`${prefixReview}/initBestReviews`);
    await store.dispatch(`${prefixReview}/getBestReviews`, { id: params.id });

    // abroad review
    await store.dispatch(`${prefixReview}/getAbroadReviews`, data);

    // question
    await store.dispatch(`${prefixQuestion}/getQuestions`, data);

    // Terms
    await store.dispatch('common/getAgreements', ['N_MMBR_BUY']);
  },
  computed: {
    ...mapGetters({
      product: `${prefix}/product`,
      // reviewTotalCount: `${prefixReview}/totalCount`,
      questionTotalCount: `${prefixQuestion}/totalCount`,
      agreementObject: 'common/agreementObject',
    }),
  },
  async created() {
    if (!this.product.id) {
      this.$popup.showAlertPopup('삭제된 상품입니다.');
      await this.$router.go(-1);
      return;
    }

    // 몰리판매불가, 해외상품여부, 링크있음
    this.sale_type = `${+!!this.product.display_only}${+!!this.product.is_abroad}${+!!this.product.detail_url}`;

    this.options = [];
    if (this.product.option_type === OPTION_TYPE_STDALN) {
      // *** 단독형 옵션 ***
      this.product.options.forEach((option, index) => {
        const data = { id: option.id, name: option.name, option_values: this.product.option_values[option.id] };
        const optionValues = this.product.option_values[option.id];

        // 재고 체크
        const newOptionValues = [];
        optionValues.forEach((value) => {
          const optionComposition = this.product.option_compositions
            .filter((composition) => composition.option_value_ids[0] === value.id)[0];
          if (optionComposition) {
            value.isSoldOut = this.isSoldOut(optionComposition);
            value.additionalPrice = optionComposition.additional_price;
            newOptionValues.push(value);
          }
        });

        data.option_values = newOptionValues;
        this.options.push(data);

        this.selectedOptionValues[index] = null;
      });
    } else if (this.product.option_type === OPTION_TYPE_ASSCTN) {
      // *** 조합형 옵션 ***
      this.product.options.forEach((option, index) => {
        const data = { id: option.id, name: option.name, option_values: [] };
        if (index === 0) {
          const optionValues = this.product.option_values[option.id];

          // 조합형 옵션이 1개일 경우에 재고체크
          if (this.product.options.length === 1) {
            const newOptionValues = [];
            optionValues.forEach((value) => {
              const optionComposition = this.product.option_compositions
                .filter((composition) => composition.option_value_ids[0] === value.id)[0];
              if (optionComposition) {
                value.isSoldOut = this.isSoldOut(optionComposition);
                value.additionalPrice = optionComposition.additional_price;
                newOptionValues.push(value);
              }
            });
            data.option_values = newOptionValues;
          } else {
            data.option_values = optionValues;
          }
        }
        this.options.push(data);

        this.selectedOptionValues[index] = null;
      });
    } else {
      // *** 옵션 없음 ***
      this.pushNONEOptionComposition();
    }
    this.nonMemberBuyAgreements = this.agreementObject('N_MMBR_BUY');
  },
  mounted() {
    if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
      this.initSelper();
    }
    if (window.facebookPixelId && window.fbq) {
      window.fbq('init', window.facebookPixelId);
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [this.product.id],
      });
    }
    // fix total count
    this.fixedReviewTotalCount = Number(this.reviewTotalCount);
    this.fixedQuestionTotalCount = Number(this.questionTotalCount);

    // this.productReviewOn = false; // 마운트 후 리뷰탭 닫기 (스와이퍼 이미지 사이즈 계산 오류 해결)
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper;
      const swiperThumbs = this.$refs.swiperThumbs.$swiper;
      swiperTop.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiperTop;
    });
    if (this.product.is_sale && !this.product.display_only) {
      this.initNaverPayBtn();
    }

    this.bodyTag = document.getElementById('body');
  },
  destroyed() {
    if (!this.bodyTag) this.bodyTag = document.getElementById('body');
    this.bodyTag.classList.remove('sc_hidden');
  },
  watch: {
    selectedOptionCompositions() {
      let totalAmount = 0;
      let totalPrice = 0;

      this.selectedOptionCompositions.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += (item.price * item.amount);
      });

      this.selectedTotalAmount = totalAmount;
      this.selectedTotalPrice = totalPrice;
    },
    onByeWrap(newValue) {
      if (!this.bodyTag) this.bodyTag = document.getElementById('body');
      if (newValue) this.bodyTag.classList.add('sc_hidden');
      else this.bodyTag.classList.remove('sc_hidden');
    },
  },
  methods: {
    initSelper() {
      const intv = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (__trackSelperViewContent) {
          const __selperProductItems = {};
          const __selperProductItem = {};
          __selperProductItem.__selperProductItemId = this.product.id; // 상품아이디
          __selperProductItem.__selperProductItemBasePrice = this.product.price; // 상품가격
          __selperProductItem.__selperProductItemSalePrice = this.product.discount_price ? this.product.discount_price : this.product.price; // 상품 판매가격
          __selperProductItem.__selperProductItemName = this.product.name; // 상품명
          __selperProductItem.__selperProductItemCurrency = 'KRW'; // 상품화폐단위
          __selperProductItem.__selperProductItemAvailability = 'I'; // 재고
          __selperProductItem.__selperProductItemQuantity = 1; // 상품수량
          __selperProductItem.__selperProductItemDescription = this.product.content; // 상품설명
          __selperProductItem.__selperProductItemBrand = this.product.store_name_kor; // 브랜드명
          __selperProductItem.__selperProductItemImageUrl = this.product.main_image; // 상품 이미지
          __selperProductItem.__selperEventType = 'ViewContent';
          __selperProductItem.__selperOSType = 'mobile';
          __selperProductItem.__selperPlatform = process.env.SELPER_PLATFORM;
          __selperProductItems.products = __selperProductItem;
          // eslint-disable-next-line no-undef
          __trackSelperViewContent(__selperProductItems);
          clearInterval(intv);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(intv);
      }, 5000);
    },
    /**
     * 품절 체크
     * @param optionComposition
     * @returns {boolean}
     */
    isSoldOut(optionComposition) {
      return optionComposition.is_inventory_managed && optionComposition.inventory_amount <= 0;
    },
    /**
     * 옵션 중복선택 체크
     * @param selectedId 등록하려는 optionCompositions의 id
     * @returns {boolean}
     */
    isDuplicationSelectedOption(selectedId) {
      const checkDuplication = _.filter(this.selectedOptionCompositions, { id: selectedId });
      return checkDuplication.length > 0;
    },
    /**
     * [조합형] 필수 옵션 선택 완료 후 옵션 선택 리스트에 옵션 구성 추가하기
     */
    pushSelectedASSCTNOptionComposition() {
      // 현재까지 선택한 옵션의 id 리스트 찾기
      const selectedOptionValueIds = _.map(this.selectedOptionValues, 'id');

      // 현재까지 선택한 옵션의 이름 리스트 가져오기
      const selectedOptionValueNames = _.map(this.selectedOptionValues, 'value');

      // 현재까지 선택한 옵션의 옵션구성 가져오기
      let selectedOptionComposition = null;
      this.product.option_compositions.forEach((composition) => {
        const isEqual = fp.flow(
          (item) => _.isEqual(new Set(selectedOptionValueIds), new Set(item)),
        )(composition.option_value_ids);
        if (isEqual) selectedOptionComposition = composition;
      });

      if (!selectedOptionComposition) return this.$popup.showAlertPopup('오류가 발생했습니다.');

      // 품절 체크
      if (this.isSoldOut(selectedOptionComposition)) {
        return this.$popup.showAlertPopup('품절된 상품입니다.');
      }

      const price = this.product.discount_price ? this.product.discount_price : this.product.price;

      // 선택한 옵션 정보 설정
      const data = {
        id: selectedOptionComposition.id,
        value: _.join(selectedOptionValueNames, '/'),
        product_id: this.product.id,
        store_id: this.product.store_id,
        additional_price: selectedOptionComposition.additional_price,
        price: price + selectedOptionComposition.additional_price,
        amount: 1,
      };

      // 옵션 중복선택 체크
      if (this.isDuplicationSelectedOption(selectedOptionComposition.id)) {
        return this.$popup.showAlertPopup('이미 선택 된 상품입니다.');
      }

      // 옵션 추가
      this.selectedOptionCompositions.push(data);
    },
    /**
     * [단독형] 옵션 선택 완료 후 옵션 선택 리스트에 옵션 구성 추가하기
     */
    pushSelectedSTDALNOptionComposition(optionIndex, selectedOptionValue) {
      // 선택한 옵션의 옵션구성 가져오기
      const selectedOptionComposition = this.product.option_compositions
        .filter((composition) => composition.option_value_ids[0] === selectedOptionValue.id)[0];

      if (!selectedOptionComposition) return this.$popup.showAlertPopup('오류가 발생했습니다.');

      // 품절 체크
      if (this.isSoldOut(selectedOptionComposition)) {
        return this.$popup.showAlertPopup('품절된 상품입니다.');
      }

      const price = this.product.discount_price ? this.product.discount_price : this.product.price;

      // 선택한 옵션 정보 설정
      const data = {
        id: selectedOptionComposition.id,
        value: selectedOptionValue.value,
        product_id: this.product.id,
        store_id: this.product.store_id,
        price: price + selectedOptionComposition.additional_price,
        additional_price: selectedOptionComposition.additional_price,
        amount: 1,
      };

      // 옵션 중복선택 체크
      if (this.isDuplicationSelectedOption(selectedOptionComposition.id)) {
        return this.$popup.showAlertPopup('이미 선택 된 상품입니다.');
      }

      // 옵션 추가
      this.selectedOptionCompositions.push(data);
    },
    /**
     * [옵션없음] 기본 상품 수량 입력 칸 생성
     */
    pushNONEOptionComposition() {
      const price = this.product.discount_price ? this.product.discount_price : this.product.price;

      const data = {
        price,
        product_id: this.product.id,
        store_id: this.product.store_id,
        amount: 1,
      };

      this.selectedOptionCompositions.push(data);
    },
    /**
     * [조합형] 선택한 옵션의 다음 depth의 옵션 리스트 업데이트
     * @param optionIndex options index
     */
    changeASSCTNOption(optionIndex) {
      const nextOption = this.product.options[optionIndex + 1];
      const nextOptionValues = this.product.option_values[nextOption.id];

      // 현재까지 선택한 옵션의 id 리스트
      const selectedOptionValueIds = fp.flow(
        (items) => _.map(items, 'id'),
        (items) => _.remove(items, (n) => n != null),
      )(this.selectedOptionValues);

      let nextOptionValueIds = [];
      const mapComposition = {};
      this.product.option_compositions.forEach((composition) => {
        // 현재까지 선택한 옵션의 composition 찾기
        const isEqual = fp.flow(
          (items) => _.intersection(items, selectedOptionValueIds),
          (items) => _.isEqual(new Set(items), new Set(selectedOptionValueIds)),
        )(composition.option_value_ids);

        // 선택 옵션의 다음 depth의 옵션 리스트 찾기
        if (isEqual) {
          const nextOptionValue = fp.flow(
            (items) => _.map(items, 'id'),
            (items) => _.intersection(items, composition.option_value_ids),
            (items) => _.head(items),
          )(nextOptionValues);

          if (nextOptionValue) {
            nextOptionValueIds.push(nextOptionValue);
            mapComposition[nextOptionValue] = composition;
          }
        }
      });
      nextOptionValueIds = _.uniq(nextOptionValueIds);

      // 다음 depth의 옵션 리스트 업데이트
      const addOptionValues = [];
      nextOptionValueIds.forEach((optionValueId) => {
        const optionValue = _.find(nextOptionValues, { id: optionValueId });
        // 마지막 옵션 리스트 추가 시, 재고 체크
        if (this.options.length - 2 === (optionIndex)) {
          const composition = mapComposition[optionValue.id];
          if (composition) {
            optionValue.isSoldOut = this.isSoldOut(composition);
            optionValue.additionalPrice = composition.additional_price;
            addOptionValues.push(optionValue);
          }
        } else {
          addOptionValues.push(optionValue);
        }
      });

      this.options[optionIndex + 1].option_values = addOptionValues;
    },
    /**
     * 공유하기 버튼 클릭 시 공유 버튼 리스트 보여주기
     */
    clickShareBtn() {
      this.showShareWrap = !this.showShareWrap;
    },
    /**
     * 옵션 선택
     * @param optionIndex options index
     */
    changeOption(optionIndex) {
      const selectedOptionValue = this.selectedOptionValues[optionIndex];

      if (this.product.option_type === OPTION_TYPE_ASSCTN) {
        // *** 조합형 옵션 ***
        if (!selectedOptionValue || optionIndex < this.options.length - 1) {
          // 상위 옵션 삭제 또는 변경 시 하위 옵션 초기화
          for (let i = optionIndex + 1; i < this.options.length; i += 1) {
            this.selectedOptionValues[i] = null;
            this.options[i].option_values = [];
          }
        }
        if (!selectedOptionValue) return;
        if (optionIndex < this.options.length - 1) {
          // 하위 depth의 옵션 정보 가져오기
          this.changeASSCTNOption(optionIndex, selectedOptionValue);
        } else {
          // 마지막 옵션 선택
          this.pushSelectedASSCTNOptionComposition();
          // 옵션 선택 초기화
          this.selectedOptionValues = [];
          for (let i = 1; i < this.options.length; i += 1) {
            this.options[i].option_values = [];
          }
        }
      } else {
        // *** 단독형 옵션 ***
        if (!selectedOptionValue) return;
        this.pushSelectedSTDALNOptionComposition(optionIndex, selectedOptionValue);
        // 옵션 선택 초기화
        this.selectedOptionValues = [];
      }
    },
    /**
     * 옵션 수량 변경 적용
     * @param index selectedOptionCompositions index
     * @param amount 변경 수량
     */
    updateOptionAmount(index, amount) {
      const item = this.selectedOptionCompositions[index];
      this.$set(item, 'amount', parseInt(amount, 10));
      this.selectedOptionCompositions.splice(index, 1, item);
    },
    /**
     * 옵션 수량 변경
     * @param event input 이벤트
     */
    changeOptionAmount(event) {
      const index = event.target.getAttribute('index');
      let amount = event.target.value;
      if (amount < 1) {
        event.target.value = 1;
        amount = 1;
        this.$popup.showAlertPopup('최소 주문 수량은 1개 입니다.');
      }
      this.updateOptionAmount(index, amount);
    },
    /**
     * 옵션 수량 감소
     * @param event 감소 버튼 이벤트
     */
    decAmount(event) {
      const index = event.target.getAttribute('index');
      let amount = event.target.parentNode.childNodes[2].value;
      if (amount <= 1) return;
      amount -= 1;
      this.updateOptionAmount(index, amount);
    },
    /**
     * 옵션 수량 증가
     * @param event 증가 버튼 이벤트
     */
    incAmount(event) {
      const index = event.target.getAttribute('index');
      let amount = event.target.parentNode.childNodes[2].value;
      amount = parseInt(amount, 10) + 1;
      this.updateOptionAmount(index, amount);
    },
    /**
     * 선택한 옵션 삭제
     * @param index selectedOptionCompositions index
     */
    delSelectedOption(index) {
      this.selectedOptionCompositions.splice(index, 1);
    },
    /**
     * 선택한 옵션을 장바구니에 저장
     * 로그인 유저 : DB insert
     * 비로그인 유저 : add cookie
     */
    async addCarts() {
      if (!this.product.is_sale) return this.$popup.showAlertPopup('해당 상품은 판매중지 된 상품입니다.');
      if (!this.selectedOptionCompositions || this.selectedOptionCompositions.length <= 0) {
        return this.$popup.showAlertPopup('옵션을 선택해 주세요.');
      }
      if (this.isLogin && this.userGrade === 0) { // 로그인
        const res = await this.$store.dispatch(`${prefixCart}/add_carts`, {
          option_compositions: this.selectedOptionCompositions,
        });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        this.popupAddedCarts();
      } else { // 비로그인
        let unknownCarts = [];
        let unknownCartsStr = Utils.getCookie(document.cookie, 'unknown_carts');
        if (unknownCartsStr) {
          unknownCartsStr = decodeURIComponent(unknownCartsStr);
          unknownCarts = JSON.parse(unknownCartsStr);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const item of this.selectedOptionCompositions) {
          const duplicatedItem = _.find(unknownCarts, { option_composition_id: item.id });
          if (duplicatedItem) {
            duplicatedItem.amount += item.amount;
          } else {
            unknownCarts.push({
              product_id: this.product.id,
              option_composition_id: item.id,
              amount: item.amount,
              store_id: this.product.store_id,
            });
          }
        }
        const newUnknownCartsStr = JSON.stringify(unknownCarts);
        if (jsUtil.strByteLength(newUnknownCartsStr) >= MAX_COOKIE_BYTE) {
          return new this.$popup.Alert({
            propsData: {
              title: '장바구니에 등록 가능한 수량을 초과하였습니다.\n로그인을 하시면 더 많은 상품을 담을 수 있습니다.',
              okCallback: async (params) => params.$destroy(),
            },
          }).$mount();
        }
        await Utils.addCookie('unknown_carts', newUnknownCartsStr);
        this.popupAddedCarts();
      }

      if (window.facebookPixelId && window.fbq) {
        window.fbq('track', 'AddToCart');
      }
    },
    async buy() {
      if (!this.product.is_sale) return this.$popup.showAlertPopup('해당 상품은 판매중지 된 상품입니다.');
      if (!this.selectedOptionCompositions || this.selectedOptionCompositions.length <= 0) {
        return this.$popup.showAlertPopup('옵션을 선택해 주세요.');
      }

      if (Utils.getUserId(document.cookie)) {
        // 회원
        await this.redirectBuy();
      } else {
        // 비회원
        new this.$popup.NonMemberOrderConfirm({
          propsData: {
            title: '비회원입니다. 비회원으로 결제를 진행하시겠습니까?',
            message: this.nonMemberBuyAgreements.content,
            okCallback: async (params) => {
              await this.redirectBuy();
              params.$destroy();
            },
          },
        }).$mount();
      }
    },
    async redirectBuy() {
      await Utils.addCookie('option_compositions', JSON.stringify(this.selectedOptionCompositions), 1000 * 60 * 60 * 2);
      this.$router.push('/order');
    },

    /**
     * 옵션 이름 가져오기
     * @param id option id
     */
    getOptionName(id) {
      const option = _.find(this.product.options, { id });
      return option.name;
    },

    /**
     * 옵션 이미지 미리보기 보여주기
     */
    showOptionPreview(option) {
      this.optionPreviewImage = option.image;
    },
    /**
     * 옵션 이미지 미리보기 숨기기
     */
    hiddenOptionPreview() {
      this.optionPreviewImage = null;
    },

    /**
     * 판매자 상세정보
     */
    popStoreInfo() {
      new Popup.StoreInfo({
        propsData: {
          title: '판매자 상세정보',
          storeInfo: this.product.store_info,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },

    popupAddedCarts() {
      new Popup.Confirm({
        propsData: {
          title: '장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?',
          okCallback: async (inParams) => {
            inParams.$destroy();
            await this.$router.push('/cart');
          },
        },
      }).$mount();
    },
    initNaverPayBtn() {
      // eslint-disable-next-line no-undef
      naver.NaverPayButton.apply({
        BUTTON_KEY: process.env.NAVER_BUTTON_KEY,
        TYPE: 'C',
        COLOR: 1,
        COUNT: 2,
        ENABLE: 'Y',
        EMBED_ID: 'naverPayWrap',
        BUY_BUTTON_HANDLER: this.naverPayBuy,
        WISHLIST_BUTTON_HANDLER: this.naverPayWishlist,
      });
    },
    async checkProducts(carts) {
      return await this.$store.dispatch('cart/check_products', {
        option_composition_ids: carts.map((v) => v.option_composition_id),
      });
    },
    async naverPayBuy() {
      if (!this.product.is_sale) return this.$popup.showAlertPopup('해당 상품은 판매중지 된 상품입니다.');
      if (!this.selectedOptionCompositions || this.selectedOptionCompositions.length <= 0) {
        return this.$popup.showAlertPopup('옵션을 선택해 주세요.');
      }

      const carts = this.selectedOptionCompositions.map((v) => ({
        product_id: v.product_id,
        option_composition_id: v.id,
        amount: v.amount,
      }));
      // 상품 데이터 체크
      let res = await this.checkProducts(carts);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      // 네이버페이 temp_order 생성
      res = await this.$store.dispatch('order/create_naver_temp_order', {
        user_id: (this.userId && this.userGrade === 0) ? this.userId : null,
        channel: 'MOBILE',
        carts,
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
        this.selectedOptionCompositions.forEach((product) => {
          numItems += parseInt(product.amount, 10);
          value += parseInt(product.price, 10);
        });
        window.fbq('track', 'Purchase', {
          content_type: 'product',
          content_ids: [this.product.id],
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

      __selperProductOrder.__selperProductOrderTotalBasePrice = tempOrder.total_price; // 주문금액
      __selperProductOrder.__selperProductOrderTotalSalePrice = tempOrder.total_price; // 결제금액
      __selperProductOrder.__selperProductOrderNo = tempOrder.order_num; // 주문번호
      __selperProductOrder.__selperEventType = 'NpayPurchase';
      __selperProductOrder.__selperOSType = 'mobile';
      __selperProductOrder.__selperPlatform = process.env.SELPER_PLATFORM;

      this.selectedOptionCompositions.forEach((v) => {
        const __selperProductItem = {};
        __selperProductItem.__selperProductItemId = this.product.id; // 상품아이디
        __selperProductItem.__selperProductItemName = this.product.name; // 상품명
        __selperProductItem.__selperProductItemBasePrice = v.price; // 상품가격
        __selperProductItem.__selperProductItemSalePrice = v.price; // 상품 판매가격
        __selperProductItem.__selperProductItemShippingPrice = v.price; // 배송비
        __selperProductItem.__selperProductItemQuantity = v.amount; // 상품수량
        __selperProductItem.__selperProductItemCurrency = 'KRW'; // 상품화폐단위
        __selperProductItem.__selperProductItemBrand = this.product.store_name_kor; // 브랜드명
        __selperProductItem.__selperUserId = this.isLogin ? this.userId : null; // 유저아이디
        __tempSelperProductList.push(__selperProductItem);
      });

      __selperProductItems.__selperPlatform = process.env.SELPER_PLATFORM;
      __selperProductItems.products = __tempSelperProductList;
      // eslint-disable-next-line no-undef
      __trackSelperPurchase(__selperProductOrder, __selperProductItems);
    },
    async naverPayWishlist() {
      this.$IMP().naver_zzim({
        naverProducts: [{
          id: this.product.id,
          name: this.product.name,
          desc: this.product.name,
          uprice: this.product.discount_price ? this.product.discount_price : this.product.price,
          url: `${window.location.origin}/product/${this.product.id}`,
          image: this.product.main_image,
        }],
      });
    },
    openProductDetail() {
      document.querySelector('.product_content_inside').style.height = 'unset';
      document.getElementById('openProductDetailButton').style.display = 'none';
    },
  },
};
