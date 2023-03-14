import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'price_group';

export default {
  name: 'mobile-price-group',
  data: () => ({
    product_list: [],
    scroll_state: null,
    isRequesting: false,
    categoryId: '',
    temp: {},

    search_filter_price: [
      { text: '전체', value: 'all', isChecked: true },
      { text: '10,000원 이하', value: '10000', isChecked: false },
      { text: '10,000원 ~ 50,000원', value: '50000', isChecked: false },
      { text: '50,000원 ~ 100,000원', value: '100000', isChecked: false },
      { text: '100,000원 ~ 300,000원', value: '300000', isChecked: false },
    ],
    search_filter_type: [
      { text: '최신순', value: 'latest', isChecked: true },
      { text: '낮은가격순', value: 'low', isChecked: false },
      { text: '높은가격순', value: 'high', isChecked: false },
    ],
    filter_price: 'all',
    filter_type: '',

    maxFileSize: (10 * 1024 * 1024),
  }),
  watch: {
    // eslint-disable-next-line func-names
    '$route.query': async function () {
      if (this.$route.name === 'price_group') {
        this.init();
      }
      if (typeof document !== 'undefined' && this.$route.name === 'price_group' && JSON.stringify(this.temp) !== JSON.stringify(this.$route.query)) {
        await this.initInfiniteScroll();
      }
    },
  },
  computed: {
    ...mapGetters({
      products: `${prefix}/products`,
      nextCursor: `${prefix}/nextCursor`,
      categoryTree: `${prefix}/categoryTree`,
      childCategories: `${prefix}/childCategories`,
      totalCount: `${prefix}/totalCount`,
    }),
  },
  async created() {
    this.init();
    this.product_list = [];
    await this.$store.dispatch(`${prefix}/initNextCursor`);
  },
  async activated() {
    if (this.$route.name === 'price_group' && JSON.stringify(this.$route.query) === '{}' && JSON.stringify(this.temp) !== '{}') {
      // 가격비교 -> 외부 페이지 -> 가격비교 페이지로 이동 시 초기화
      await this.initInfiniteScroll();
      this.init();
      this.temp = {};
    } else if (this.$route.name === 'price_group' && (this.$route.query.q || this.$route.query.cate) && JSON.stringify(this.temp) !== JSON.stringify(this.$route.query)) {
      // 가격비교 -> 외부 페이지에서 검색/카테고리 유입 한 경우
      await this.initInfiniteScroll();
      this.init();
    }
  },
  methods: {
    async infiniteHandler($state) {
      const { query } = this.$route;
      this.temp = query;
      this.scroll_state = $state;
      if (this.nextCursor === '0' || this.nextCursor === 'None') return $state.complete(); // 다음 페이지 없음
      if (this.isRequesting) return;
      this.isRequesting = true;
      await this.$store.dispatch(`${prefix}/getProducts`, { ...query, cursor: this.nextCursor });
      if (!this.products || this.products.length <= 0) return $state.complete(); // 조회되는 상품이 없음
      this.product_list.push(...this.products);
      this.isRequesting = false;
      $state.loaded();
    },
    init() {
      const { query } = this.$route;
      this.categoryId = query.cate;

      if (Object.prototype.hasOwnProperty.call(query, 'filter_price')) {
        const value = query.filter_price;
        this.filter_price = query.filter_price;
        this.search_filter_price.forEach((item) => {
          if (value === item.value) item.isChecked = true;
          else item.isChecked = false;
        });
      } else {
        this.search_filter_price.forEach((item, index) => { item.isChecked = (index === 0); });
        this.filter_price = this.search_filter_price[0].value;
      }
      if (Object.prototype.hasOwnProperty.call(query, 'filter_type')) {
        const value = query.filter_type;
        this.search_filter_type[0].isChecked = false;
        Array.prototype.find.call(this.search_filter_type, (item) => {
          if (value === item.value) {
            item.isChecked = true;
            return item;
          }
        });
      } else {
        this.search_filter_type.forEach((item, index) => { item.isChecked = (index === 0); });
      }
    },
    async initInfiniteScroll() {
      this.product_list = [];
      this.isRequesting = false;
      await this.$store.dispatch(`${prefix}/initNextCursor`);
      if (this.scroll_state) this.scroll_state.reset();
    },
    async onSearchFilter(e) {
      const query = { ...this.$route.query };
      query.filter_price = e.currentTarget.value;
      this.search_filter_type.forEach((item) => {
        if (item.isChecked) query.filter_type = item.value;
      });
      await this.$router.push({ query });
      this.temp = query;
      await this.initInfiniteScroll();
    },
    async onSearchFilterType(target) {
      this.search_filter_type.forEach((item) => { item.isChecked = false; });
      this.search_filter_type[target].isChecked = true;

      const query = { ...this.$route.query };
      query.filter_type = this.search_filter_type[target].value;

      await this.$router.push({ query });
      await this.initInfiniteScroll();
    },
    async clickCategory(category) {
      const query = { ...this.$route.query };
      if (category.id === this.categoryId) {
        this.categoryId = '';
      } else {
        this.categoryId = category.id;
        query.cate = this.categoryId;
      }

      await this.$router.push({ query });
      this.temp = query;
      await this.initInfiniteScroll();
    },
    async uploadImage() {
      new Popup.PriceGroupImageSearch({
        propsData: {
          okCallback: async (params) => {
            this.$router.push({
              name: 'price_group-search',
              params: { file: params.uploadFile, categoryId: params.lastCategoryId },
            });
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
