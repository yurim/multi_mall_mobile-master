const urlPrefix = 'price_group';
const urlPrefixProduct = 'product';

const state = () => ({
  productPriceGroup: {},
  groupProductPage: 0,
  groupProductPageSize: 0,
  groupProductTotalCount: 0,
  groupProductTotalPages: 0,
  product: {},
});

const actions = {
  async getProductPriceGroup({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.groupId}`, { params: data.query });
    await commit('setProductPriceGroup', res.data.data);
    return res.data;
  },

  async getProduct({ commit }, id) {
    const res = await this.$axios.get(`${urlPrefixProduct}/${id}`);
    await commit('setProduct', res.data.data);
    return res.data;
  },
};

const mutations = {
  setProductPriceGroup(state, data) {
    if (data.product_price_group) state.productPriceGroup = data.product_price_group;
    if (data.total_count) state.groupProductTotalCount = data.total_count;
    if (data.page) state.groupProductPage = data.page;
    if (data.page_size) state.groupProductPageSize = data.page_size;
    if (data.total_pages) state.groupProductTotalPages = data.total_pages;
  },
  setProduct(state, data) {
    if (data.product) state.product = data.product;
  },
  updateGroupProductPage(state, data) {
    state.groupProductPage = data.page;
    state.groupProductPageSize = data.pageSize;
  },
};

const getters = {
  productPriceGroup: (state) => state.productPriceGroup,
  groupProductTotalCount: (state) => state.groupProductTotalCount,
  groupProductPage: (state) => state.groupProductPage,
  groupProductPageSize: (state) => state.groupProductPageSize,
  groupProductTotalPages: (state) => state.groupProductTotalPages,
  product: (state) => state.product,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
