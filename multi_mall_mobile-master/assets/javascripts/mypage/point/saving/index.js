import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/point/saving';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    loading: false,
    defaultPage: 1,
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getSavingHistory`, query);
    await store.dispatch(`${prefix}/getCurrentPoint`);
  },
  computed: {
    ...mapGetters({
      savingHistory: `${prefix}/savingHistory`,
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
    async getSavingHistories(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getSavingHistory`, query);
      this.loading = false;
    },
    async onPage(query) {
      await this.getSavingHistories(query);
    },
  },
};
