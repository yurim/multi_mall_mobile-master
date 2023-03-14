import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/review';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    typedReviews: [],
    typedTotalCount: 0,
    typedPageSize: 50,
    typedDefaultPage: 1,
    typeReviews: [],
    typeTotalCount: 0,
    typePageSize: 50,
    typeDefaultPage: 1,
    tabType: 'write',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getAvailableOrderProducts`, query);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      orderProductTotalCount: `${prefix}/orderProductTotalCount`,
      orderProductPageSize: `${prefix}/orderProductPageSize`,

      reviews: `${prefix}/reviews`,
      reviewTotalCount: `${prefix}/reviewTotalCount`,
      reviewPageSize: `${prefix}/reviewPageSize`,

      result: `${prefix}/result`,
    }),
  },
  watch: {
    async tabType(newValue) {
      if (newValue === 'write') {
        await this.refreshAvailableOrderProducts();
      } else {
        await this.refreshReviews();
      }
    },
  },
  methods: {
    async refreshAvailableOrderProducts() {
      const query = { ...this.$route.query };
      await this.getAvailableOrderProducts(query);
    },
    async refreshReviews() {
      const query = { ...this.$route.query };
      await this.getReviews(query);
    },

    async getAvailableOrderProducts(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getAvailableOrderProducts`, query);
      this.loading = false;
    },
    async getReviews(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getReviews`, query);
      this.loading = false;
    },

    popReview(orderProduct) {
      let productPrice = (orderProduct.product_discount_price) ? orderProduct.product_discount_price : orderProduct.product_price;
      productPrice += orderProduct.option_price;
      const data = {
        product_name: orderProduct.product_name,
        product_option_names: orderProduct.product_option_names,
        amount: orderProduct.amount,
        product_price: productPrice,
        ordered_at: orderProduct.ordered_at,
        store_name_kor: orderProduct.store_name_kor,
        product_image: orderProduct.product_image,
      };
      new this.$popup.ReviewWrite({
        propsData: {
          data,
          okCallback: async (params) => {
            if (params.content && params.rate) {
              const formData = new FormData();
              formData.append('order_product_id', orderProduct.id);
              formData.append('content', params.content);
              formData.append('score', params.rate);
              params.reviewImages.forEach((value) => {
                formData.append('reviewImages', value);
              });

              await this.$store.dispatch(`${prefix}/createReview`, formData);
              if (this.result.result === 'success') {
                this.popAlert('리뷰가 등록되었습니다.');
                this.tabType = 'wrote';
              } else this.popAlert(this.result.message);
            } else {
              this.popAlert('리뷰를 작성해주세요.');
            }
            params.$destroy();
          },
        },
      }).$mount();
    },
    popAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    async onReviewPage(query) {
      await this.getReviews(query);
    },
    async onOrderProductPage(query) {
      await this.getAvailableOrderProducts(query);
    },
    async showReviewPopup(review) {
      new this.$popup.ReviewShow({
        propsData: {
          review,
        },
      }).$mount();
    },
  },
};
