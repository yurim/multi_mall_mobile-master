import { mapGetters } from 'vuex';

const prefix = 'product/review';

export default {
  props: {
    product: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
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
        { key: 'photo', text: '포토리뷰' },
        { key: 'text', text: '텍스트리뷰' },
        { key: 'best', text: '베스트리뷰' },
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
      moreReview: false,

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
    }),
  },
  created() {
    const query = { ...this.$route.query };
    this.reviewCurrPage = query.review_page ? parseInt(query.review_page, 10) : 1;
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
  methods: {
    // 국내 리뷰 func
    async getReviews(query) {
      this.loading = true;
      const params = this.$route.params;
      const data = { id: params.id, query };
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
      const params = this.$route.params;
      query.page = query.abroad_review_page;
      query.page_size = query.abroad_review_page_size;
      const data = { id: params.id, query };
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

    expandReply(index, isExpend) {
      const review = this.reviews[index];
      review.replyExpand = isExpend;
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
    async getNextBestReview() {
      const pageSize = 10;
      if (this.bestReviewCurrPage * pageSize > this.bestReviewTotalCount) return;
      this.loading = true;
      const params = this.$route.params;
      const data = { id: params.id, query: { best_review_page: this.bestReviewCurrPage + 1, best_review_page_size: pageSize } };
      await this.$store.dispatch(`${prefix}/getBestReviews`, data);
      this.loading = false;
    },
  },
};
