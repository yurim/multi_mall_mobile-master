import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'price_group/search';

export default {
  name: 'mobile-price-group-search',
  data: () => ({
    maxFileSize: (10 * 1024 * 1024),

    uploadFile: null,
    uploadFileUrl: null,
    uploadFileName: null,

    selectCategoryId: null,

    groupList: [],
    scrollState: null,
    isRequesting: false,
  }),
  computed: {
    ...mapGetters({
      productPriceGroups: `${prefix}/productPriceGroups`,
      categoryTree: `${prefix}/categoryTree`,
      relatedCategories: `${prefix}/relatedCategories`,
      page: `${prefix}/page`,
      pageSize: `${prefix}/pageSize`,
      visionLabelMids: `${prefix}/visionLabelMids`,
    }),
  },
  watch: {
    // eslint-disable-next-line func-names
    '$route.query._r': async function (newValue) { // 같은 path에서 params 데이터 수정하여 페이지 이동하기 위해서, query _r을 랜덤으로 줌 (Header 검색)
      if (!newValue) return;
      const file = this.$route.params.file;
      const categoryId = this.$route.params.categoryId;
      if (file && categoryId) {
        await this.firstImageSearch(file, categoryId);
      }
    },
  },
  async created() {
    const file = this.$route.params.file;
    const categoryId = this.$route.params.categoryId;
    if (file && categoryId) {
      await this.firstImageSearch(file, categoryId);
    }
  },
  async activated() {
    const file = this.$route.params.file;
    const categoryId = this.$route.params.categoryId;
    if (file && categoryId) {
      await this.firstImageSearch(file, categoryId);
    }
  },
  methods: {
    async initInfiniteScroll() {
      this.groupList = [];
      this.isRequesting = false;
      await this.$store.dispatch(`${prefix}/setPage`, 0);
      if (this.scrollState) this.scrollState.reset();
    },
    async infiniteHandler($state) {
      this.scrollState = $state;
      if (this.isRequesting) return;
      this.isRequesting = true;

      const formData = new FormData();
      formData.append('page', this.page + 1);
      if (this.selectCategoryId) formData.append('category_id', this.selectCategoryId);
      if (this.visionLabelMids) {
        this.visionLabelMids.forEach((v) => formData.append('vision_label_mids[]', v));
      } else if (this.uploadFile) formData.append('image', this.uploadFile);
      else return $state.complete(); // 검색할 이미지가 업로드 되지 않음

      await this.$store.dispatch(`${prefix}/searchProductPriceGroups`, formData);
      if (!this.productPriceGroups || this.productPriceGroups.length <= 0) return $state.complete(); // 조회되는 상품이 없음
      this.groupList.push(...this.productPriceGroups);
      this.isRequesting = false;
      $state.loaded();
    },
    async firstImageSearch(imageFile, categoryId) {
      this.selectCategoryId = categoryId;
      this.uploadFileUrl = window.URL.createObjectURL(imageFile);
      this.uploadFileName = imageFile.name;
      this.uploadFile = imageFile;
      await this.$store.dispatch(`${prefix}/initVisionLabelMids`);

      await this.initInfiniteScroll();
    },
    async uploadImage() {
      new Popup.PriceGroupImageSearch({
        propsData: {
          okCallback: async (params) => {
            await this.firstImageSearch(params.uploadFile, params.lastCategoryId);
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
