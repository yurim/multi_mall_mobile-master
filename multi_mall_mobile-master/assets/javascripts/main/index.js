import { mapGetters } from 'vuex';
import SelperMixin from '@/components/SelperCommonMixin';

const prefix = 'main';

export default {
  name: 'mobile-main',
  mixins: [SelperMixin],
  data() {
    return {
      product_list: [],

      isRequesting: false,
    };
  },
  computed: {
    ...mapGetters({
      products: `${prefix}/products`,
      nextCursor: `${prefix}/nextCursor`,
    }),
  },
  methods: {
    async infiniteHandler($state) {
      const { query } = this.$route;
      this.scroll_state = $state;
      if (this.nextCursor === '0' || this.nextCursor === 'None') return $state.complete(); // 다음 페이지 없음
      if (this.isRequesting) return;
      this.isRequesting = true;
      await this.$store.dispatch(`${prefix}/getProducts`, { ...query,
        cursor: this.nextCursor,
        cate: 'all',
      });
      if (!this.products || this.products.length <= 0) return $state.complete(); // 조회되는 상품이 없음
      this.product_list.push(...this.products);
      this.isRequesting = false;
      $state.loaded();
    },
  },
};
