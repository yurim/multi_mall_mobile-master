import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'store';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    loading: false,
    storeTypeList: [],
    storeTypeSortOrder: ['ABROAD', 'INTERNET', 'ROAD', 'BRAND'], // 화면에 storeType 정렬하여 배치(해외직구 쇼핑몰 - 인터넷 쇼핑몰 - 로드샵 - 브랜드샵)
    store_type: '',
    filter_sort: 'best',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getStores`, query);
    await store.dispatch('common/getCodes', ['store_type', 'age_target']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      stores: `${prefix}/stores`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
    storeList() {
      this.stores.forEach((store) => {
        store.age_target_str = [];
        store.age_target.forEach((age) => {
          this.codesArray('age_target').reduce((list, type) => {
            if (type.key === age) list.push(type.value);
            return list;
          }, store.age_target_str);
        });
      });
      return this.stores;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    console.log(this.store_type);
  },
  methods: {
    initCommonCodes() {
      this.storeTypeList = this.codesArray('store_type');
    },
    initStoreType() {
      const query = { ...this.$route.query };
      if (Object.prototype.hasOwnProperty.call(query, 'store_type')) {
        if (query.store_type) this.store_type = query.store_type;
      }
      const reversedKeys = [...this.storeTypeSortOrder].reverse();
      reversedKeys.forEach((key) => {
        this.sortStoreType(key);
      });
    },
    init() {
      this.initCommonCodes();
      this.initStoreType();
    },
    sortStoreType(firstKey) {
      // key가 firstKey 인 storeType을 맨 앞으로 가져옴
      this.storeTypeList = this.storeTypeList.sort((x, y) => {
        if (x.key === firstKey) return -1;
        if (y.key === firstKey) return 1;
        return 0;
      });
    },
    async getStores(query) {
      this.loading = true;
      await this.$router.push({ query });
      await this.$store.dispatch(`${prefix}/getStores`, query);
      this.loading = false;
    },
    onChangeStoreList(type) {
      const query = { ...this.$route.query };
      query.store_type = type;
      this.store_type = type;
      this.getStores(query);
    },
    onSortFilter(filter) {
      const query = { ...this.$route.query };
      query.filter_sort = filter;
      this.filter_sort = filter;
      this.getStores(query);
    },
    pageToRedirect(target, targetId) {
      if (target.indexOf('store') > -1) this.$router.push({ name: 'store-id', params: { id: targetId } });
      if (target.indexOf('product') > -1) this.$router.push({ name: 'product-id', params: { id: targetId } });
    },
  },
};
