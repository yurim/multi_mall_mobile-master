import { mapGetters } from 'vuex';

import StickyMixin from '@/components/StickyMixin';

const prefix = 'price_group/_id';
const prefixReview = 'product/review';
const prefixOtherStore = 'price_group/_id/other_store_product_review';

export default {
  mixins: [StickyMixin],
  data: () => ({
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

    mainGroupProducts: [],
    defaultPage: 1,

    lowest_btn_type: null,
  }),
  async fetch({ store, params, redirect }) {
    // *** params.id : product id ***
    // 상품 정보
    const productRes = await store.dispatch(`${prefix}/getProduct`, params.id);
    if (!productRes.data.product) return redirect('/main');
    if (!productRes.data.product.product_price_group_id) return redirect('/main');

    const groupId = productRes.data.product.product_price_group_id;

    // product_price_group
    const groupRes = await store.dispatch(`${prefix}/getProductPriceGroup`, { groupId, query: { page_size: 4 } });
    if (!groupRes.data.product_price_group) return redirect('/main');

    // other product reviews
    await store.dispatch(`${prefixOtherStore}/getOtherProductScores`, groupId);
    await store.dispatch(`${prefixOtherStore}/getOtherProductPhotoReviews`, { groupId });
    await store.dispatch(`${prefixOtherStore}/getOtherProductReviews`, { groupId, query: { page_size: 5 } });
  },
  computed: {
    ...mapGetters({
      productPriceGroup: `${prefix}/productPriceGroup`,
      groupProductTotalCount: `${prefix}/groupProductTotalCount`,
      groupProductPage: `${prefix}/groupProductPage`,
      groupProductPageSize: `${prefix}/groupProductPageSize`,
      groupProductTotalPages: `${prefix}/groupProductTotalPages`,
      product: `${prefix}/product`, // 최저가 상품 정보
    }),
  },
  async created() {
    if (!this.productPriceGroup.id) {
      this.$popup.showAlertPopup('잘못된 접근입니다.');
      await this.$router.go(-1);
    }

    // 최저가 상품 구매하기 버튼 타입 지정
    // 몰리판매불가, 해외상품여부, 링크있음
    this.lowest_btn_type = `${+!!this.product.display_only}${+!!this.product.is_abroad}${+!!this.product.detail_url}`;

    await this.initMainGroupProducts();

    const data = { id: this.product.id };
    // review
    await this.$store.dispatch(`${prefixReview}/getReviews`, data);
    await this.$store.commit(`${prefixReview}/initBestReviews`);
    await this.$store.dispatch(`${prefixReview}/getBestReviews`, data);

    // abroad review
    await this.$store.dispatch(`${prefixReview}/getAbroadReviews`, data);
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper;
      const swiperThumbs = this.$refs.swiperThumbs.$swiper;
      swiperTop.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiperTop;
    });
  },
  methods: {
    initMainGroupProducts() {
      this.mainGroupProducts = this.productPriceGroup.products;
    },
    openProductDetail() {
      document.querySelector('.product_content_inside').style.height = 'unset';
      document.getElementById('openProductDetailButton').style.display = 'none';
    },
    async onPage(query) {
      const params = {
        groupId: this.productPriceGroup.id,
        query: { page: query.page, page_size: 4 },
      };
      await this.$store.commit(`${prefix}/updateGroupProductPage`, params.query);
      await this.$store.dispatch(`${prefix}/getProductPriceGroup`, params);
    },
  },
};
