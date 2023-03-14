import { mapGetters } from 'vuex';

const prefix = 'product/review';
const otherStorePrefix = 'price_group/_id/other_store_product_review';

export default {
  props: {
    product: {
      type: Object,
      default: {},
    },
    groupId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {

      activeReviewScoreTab: 'lowest', // lowest, other
      activePhotoReviewTab: 'lowest', // lowest, other
      activeAbroadReviewTab: 'lowest', // lowest, other
      activeReviewTab: 'lowest', // lowest, other

      textReviewSlide: {
        slidesPerView: 'auto',
        freeMode: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.text_review_slide_prev',
          prevEl: '.text_review_slide_next',
        },
      },

      photoReviewSlide: {
        loop: false,
        spaceBetween: 10,
        slidesPerView: 3,
        slidesPerGroup: 1,
        navigation: {
          nextEl: '.photo_review_slide_next',
          prevEl: '.photo_review_slide_prev',
        },
      },
      photoOtherReviewSlide: {
        loop: false,
        spaceBetween: 10,
        slidesPerView: 3,
        slidesPerGroup: 1,
        // freeMode: true,
        navigation: {
          nextEl: '.photo_other_review_slide_next',
          prevEl: '.photo_other_review_slide_prev',
        },
      },

      // Pagination
      reviewCurrPage: 1,
      abroadReviewCurrPage: 1,

      // review sort tab
      reviewSortTabs: [
        { key: 'latest', text: '최신순' },
        { key: 'highest', text: '평점 높은순' },
        { key: 'lowest', text: '평점 낮은순' },
      ],
      activeReviewSortTab: 'latest',
      activeAbroadReviewSortTab: 'latest',

      // review type tab
      reviewTypeTabs: [
        { key: 'all', text: '전체' },
        { key: 'photo', text: '포토 리뷰' },
        { key: 'text', text: '일반 리뷰' },
        { key: 'best', text: '베스트 리뷰' },
      ],
      activeReviewTypeTab: 'all',

      // abroad review type tab
      abroadReviewTypeTabs: [
        { key: 'all', text: '전체' },
        { key: 'photo', text: '포토 리뷰' },
        { key: 'text', text: '일반 리뷰' },
      ],
      activeAbroadReviewTypeTab: 'all',

      isAbroadTranslation: true,

      moreAbroadReview: false,
      moreOtherAbroadReview: false,
      moreReview: false,
      moreOtherReview: false,

      // best review
      swiperOption: {
        loop: false,
        slidesPerView: 5,
        slidesPerGroup: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },

      // other photo reviews
      otherPhotoReviews: [],
      otherPhotoReviewPageSize: 2,
      otherPhotoReviewCurrPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      reviews: `${prefix}/reviews`,
      reviewTotalCount: `${prefix}/totalCount`,
      reviewPageSize: `${prefix}/pageSize`,
      textReviewPoint: `${prefix}/textReviewPoint`,
      photoReviewPoint: `${prefix}/photoReviewPoint`,

      bestReviews: `${prefix}/bestReviews`,
      bestReviewCurrPage: `${prefix}/bestReviewCurrPage`,
      bestReviewTotalCount: `${prefix}/bestReviewTotalCount`,
      bestReviewPageSize: `${prefix}/bestReviewPageSize`,

      abroadReviews: `${prefix}/abroadReviews`,
      abroadReviewTotalCount: `${prefix}/abroadTotalCount`,
      abroadReviewPageSize: `${prefix}/abroadPageSize`,

      otherReviews: `${otherStorePrefix}/reviews`,
      otherAbroadReviews: `${otherStorePrefix}/abroadReviews`,
      otherResPhotoReview: `${otherStorePrefix}/resPhotoReview`,
      otherProductScores: `${otherStorePrefix}/productScores`,
    }),
  },
  watch: {
    async activeReviewSortTab() {
      await this.changeTab();
    },
    async activeReviewTypeTab() {
      await this.changeTab();
    },
    async activeAbroadReviewSortTab() {
      await this.changeAbroadTab();
    },
    async activeAbroadReviewTypeTab() {
      await this.changeAbroadTab();
    },
  },
  async created() {
    await this.initOtherPhotoReviews();
    await this.getNextOtherPhotoReview(); // 다른 매장 포토리뷰 2페이지 미리 로드
  },
  methods: {
    initOtherPhotoReviews() {
      this.otherPhotoReviews = this.otherResPhotoReview.reviews;
    },
    // 국내 리뷰 func
    async getReviews(query) {
      this.loading = true;
      const data = { id: this.product.id, query };
      await this.$store.dispatch(`${prefix}/getReviews`, data);
      this.loading = false;
    },
    async onReviewsPage(query) {
      this.reviewCurrPage = query.review_page;
      query.review_sort = this.activeReviewSortTab;
      query.review_type = this.activeReviewTypeTab;
      await this.getReviews(query);
    },
    async changeTab() {
      const query = { ...this.$route.query };
      this.reviewCurrPage = 1;
      if (query.review_page !== '1') {
        query.review_page = 1;
        await this.$router.replace({ query });
      }
      query.review_sort = this.activeReviewSortTab;
      query.review_type = this.activeReviewTypeTab;
      await this.getReviews(query);
    },

    // 해외 리뷰 func
    async getAbroadReviews(query) {
      this.loading = true;
      query.page = query.abroad_review_page;
      query.page_size = query.abroad_review_page_size;
      const data = { id: this.product.id, query };
      await this.$store.dispatch(`${prefix}/getAbroadReviews`, data);
      this.loading = false;
    },
    async onAbroadReviewsPage(query) {
      this.abroadReviewCurrPage = query.abroad_review_page;
      query.review_sort = this.activeAbroadReviewSortTab;
      query.review_type = this.activeAbroadReviewTypeTab;
      await this.getAbroadReviews(query);
    },
    async changeAbroadTab() {
      const query = { ...this.$route.query };
      this.abroadReviewCurrPage = 1;
      if (query.abroad_review_page !== '1') {
        query.abroad_review_page = 1;
        await this.$router.replace({ query });
      }
      query.review_sort = this.activeAbroadReviewSortTab;
      query.review_type = this.activeAbroadReviewTypeTab;
      await this.getAbroadReviews(query);
    },

    expandAbroadReview(index, isExpand) {
      const review = this.abroadReviews[index];
      review.expand = isExpand;
      this.abroadReviews.splice(index, 1, review);
    },
    expandReview(index, isExpand) {
      const review = this.reviews[index];
      review.expand = isExpand;
      this.reviews.splice(index, 1, review);
    },

    async showReviewPopup(review, isAbroad) {
      let reviewData = {};
      if (isAbroad) {
        reviewData = {
          id: review.id,
          review_images: [review.image_url],
          name: review.writer_id,
          created_at: review.created_at,
          option_values: review.option_values,
          content: review.content,
          translation_content: review.translation_content,
          score: review.score,
        };
      } else {
        reviewData = review;
      }
      reviewData.isAbroad = isAbroad;
      new this.$popup.ReviewShow({
        propsData: {
          review: reviewData,
        },
      }).$mount();
    },

    /**
     * 베스트 리뷰 swiper 페이지네이션
     */
    async getNextLowestPhotoReview() {
      const pageSize = 10;
      if (this.bestReviewCurrPage * pageSize > this.bestReviewTotalCount) return;
      this.loading = true;
      const data = { id: this.product.id, query: { best_review_page: this.bestReviewCurrPage + 1, best_review_page_size: pageSize } };
      await this.$store.dispatch(`${prefix}/getBestReviews`, data);
      this.loading = false;
    },

    async getOtherPhotoReviews() {
      this.otherPhotoReviewCurrPage += 1;
      const data = {
        groupId: this.groupId,
        query: {
          page: this.otherPhotoReviewCurrPage,
          pageSize: this.otherPhotoReviewPageSize,
        },
      };
      await this.$store.dispatch(`${otherStorePrefix}/getOtherProductPhotoReviews`, data);
      if (this.otherResPhotoReview.reviews.length <= 0) {
        return await this.getOtherPhotoAbroadReviews();
      }
      this.otherPhotoReviews.push(...this.otherResPhotoReview.reviews);
    },
    async getOtherPhotoAbroadReviews() {
      const data = {
        groupId: this.groupId,
        query: {
          cursor: this.otherResPhotoReview.nextCursor,
          pageSize: this.otherPhotoReviewPageSize,
        },
      };
      await this.$store.dispatch(`${otherStorePrefix}/getOtherProductPhotoAbroadReviews`, data);
      this.otherPhotoReviews.push(...this.otherResPhotoReview.reviews);
    },

    /**
     * 포토 리뷰 swiper 페이지네이션
     * - 국내 포토리뷰 -> 해외 포토리뷰 순으로 조회
     * - 국내 포토리뷰 조회 완료(마지막 페이지) 시 해외 포토리뷰 조회 시작
     * - resPhotoReview.type 으로 스위칭
     *   - default : 국내 포토리뷰
     *   - abroad : 해외 포토리뷰
     */
    async getNextOtherPhotoReview() {
      if (this.otherResPhotoReview.target === 'default') { // 현재 조회중인 포토리뷰는 국내리뷰
        if (this.otherResPhotoReview.reviews.length === this.otherPhotoReviewPageSize) { // 국내 포토리뷰 다음페이지 조회
          await this.getOtherPhotoReviews();
        } else { // 국내 포토리뷰 조회 완료, 해외 포토리뷰 조회
          await this.getOtherPhotoAbroadReviews();
        }
      } else { // 현재 조회중인 포토리뷰는 해외리뷰
        // eslint-disable-next-line no-lonely-if
        if (this.otherResPhotoReview.reviews.length === this.otherPhotoReviewPageSize) { // 해외 포토리뷰 다음페이지 조회
          await this.getOtherPhotoAbroadReviews();
        }
      }
    },
  },
};
