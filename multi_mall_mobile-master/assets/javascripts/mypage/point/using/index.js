import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/point/using';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    loading: false,
    defaultPage: 0,
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getUsingHistory`, query);
    await store.dispatch(`${prefix}/getCurrentPoint`);
  },
  computed: {
    ...mapGetters({
      usingHistory: `${prefix}/usingHistory`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      current_point: `${prefix}/current_point`,
    }),
  },
  created() {
    const query = { ...this.$route.query };
    this.defaultPage = query.page ? parseInt(query.page, 10) : 1;
  },
  methods: {
    async getUsingHistories(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getUsingHistory`, query);
      this.loading = false;
    },
    async onPage(query) {
      this.defaultPage = query.page ? parseInt(query.page, 10) : 1;
      await this.getUsingHistories(query);
    },
  },
};
