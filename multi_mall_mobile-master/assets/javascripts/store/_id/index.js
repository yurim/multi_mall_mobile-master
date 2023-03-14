import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'store/_id';

export default {
  name: 'mobile-store-id',
  mixins: [SelperCommonMixin],
  data: () => ({
    product_list: [],
    scroll_state: null,
    isRequesting: false,

    category_id: '',
    filter_sorts: [
      // { text: '몰 추천순', value: 'best' },
      { text: '최신순', value: 'latest' },
      { text: '판매량순', value: 'sale' },
      { text: '낮은가격순', value: 'low' },
      { text: '높은가격순', value: 'high' },
    ],
    filter_sort: 'latest',
    currentPage: 1,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getStore`, params.id);
    await store.dispatch('common/getCodes', ['age_target']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      store: `${prefix}/store`,
      products: `${prefix}/products`,
      nextCursor: `${prefix}/nextCursor`,
    }),
    storeInfo() {
      this.store.age_target_str = [];
      this.store.age_target.forEach((age) => {
        this.codesArray('age_target').reduce((list, type) => {
          if (type.key === age) list.push(type.value);
          return list;
        }, this.store.age_target_str);
      });
      return this.store;
    },
    productList() {
      this.products.forEach((product) => {
        product.discount_rate = 0;
        if (product.discount_price) product.discount_rate = (product.discount_price / product.price) * 100;
      });
      return this.products;
    },
  },
  filters: {
    discountRateRound(value) {
      if (value) {
        const rate = parseFloat(value);
        if (rate && rate % 1 === 0) return rate.toFixed(0);
        if (rate && rate % 1 !== 0) return rate.toFixed(1);
        return rate;
      }
    },
  },
  async created() {
    this.init();
    this.product_list = [];
    await this.$store.dispatch(`${prefix}/initNextCursor`);
  },
  methods: {
    init() {
      const { query } = this.$route;

      if (Object.prototype.hasOwnProperty.call(query, 'filter_sort')) {
        this.filter_sort = query.filter_sort;
      } else {
        this.filter_sort = this.filter_sorts[0].value;
      }
      if (Object.prototype.hasOwnProperty.call(query, 'category_id')) {
        this.category_id = query.category_id;
      } else {
        this.category_id = null;
      }
    },
    async infiniteHandler($state) {
      const { query } = this.$route;
      this.scroll_state = $state;
      if (this.nextCursor === '0' || this.nextCursor === 'None') return $state.complete(); // 다음 페이지 없음
      if (this.isRequesting) return;
      this.isRequesting = true;
      const data = { id: this.store.id, query: { ...query, cursor: this.nextCursor } };
      await this.$store.dispatch(`${prefix}/getProducts`, data);
      if (!this.products || this.products.length <= 0) return $state.complete(); // 조회되는 상품이 없음
      this.product_list.push(...this.products);
      this.isRequesting = false;
      $state.loaded();
    },
    async initInfiniteScroll() {
      this.product_list = [];
      await this.$store.dispatch(`${prefix}/initNextCursor`);
      this.scroll_state.reset();
    },
    async onFilterSort(type) {
      const query = { ...this.$route.query };
      query.filter_sort = type;
      this.filter_sort = type;
      await this.$router.push({ query });
      await this.initInfiniteScroll(query);
    },
    async clickCategory(category) {
      const query = { ...this.$route.query };
      this.category_id = category.id;
      if (!category.id) {
        delete query.category_id;
      } else {
        query.category_id = this.category_id;
      }
      await this.$router.push({ query });
      await this.initInfiniteScroll(query);
    },
    popStoreInfo() {
      new Popup.StoreInfo({
        propsData: {
          title: '판매자 상세정보',
          storeInfo: this.store.store_info,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
