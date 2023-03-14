import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/inquiry/product';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    defaultPage: 0,
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getProductInquiryList`, query);
  },
  created() {
    const query = { ...this.$route.query };
    this.defaultPage = query.page ? parseInt(query.page, 10) : 1;
  },
  computed: {
    ...mapGetters({
      productInquiryList: `${prefix}/productInquiryList`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
  },
  methods: {
    async refresh() {
      const query = { ...this.$route.query };
      await this.getProductInquiryList(query);
    },
    async getProductInquiryList(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getProductInquiryList`, query);
      this.loading = false;
    },
    async onProductInquiryListPage(query) {
      await this.getProductInquiryList(query);
    },

    /**
     * 문의 삭제하기
     * @param questionId product_question_id
     */
    async deleteQuestion(questionId) {
      new this.$popup.Confirm({
        propsData: {
          title: '문의를 삭제하시겠습니까?',
          okCallback: async (params) => {
            const data = { product_question_id: questionId };
            const res = await this.$store.dispatch(`${prefix}/deleteInquiry`, data);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
