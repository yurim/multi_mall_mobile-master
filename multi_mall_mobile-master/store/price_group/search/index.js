const prefix = 'price_group';

const state = () => ({
  productPriceGroups: [],
  categoryTree: [],
  relatedCategories: [],
  page: 0,
  pageSize: 0,
  visionLabelMids: null,
});

const actions = {
  async searchProductPriceGroups({ commit }, formData) {
    const res = await this.$axios.post(`${prefix}/image-search`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    await commit('setProductPriceGroups', res.data);
    return res.data;
  },
  async setPage({ commit }, page) {
    await commit('setPage', page);
  },
  async initVisionLabelMids({ commit }) {
    await commit('setVisionLabelMids', null);
  },
};

const mutations = {
  setProductPriceGroups(state, res) {
    state.productPriceGroups = res.data.price_groups;
    state.categoryTree = res.data.category_tree;
    if (res.data.related_categories) state.relatedCategories = res.data.related_categories;
    if (res.data.page) state.page = res.data.page;
    if (res.data.page_size) state.pageSize = res.data.page_size;
    if (res.data.vision_label_mids) state.visionLabelMids = res.data.vision_label_mids;
  },
  async setPage(state, page) {
    state.page = page;
  },
  async setVisionLabelMids(state, data) {
    state.visionLabelMids = data;
  },
};

const getters = {
  productPriceGroups: (state) => state.productPriceGroups,
  categoryTree: (state) => state.categoryTree,
  relatedCategories: (state) => state.relatedCategories,
  page: (state) => state.page,
  pageSize: (state) => state.pageSize,
  visionLabelMids: (state) => state.visionLabelMids,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
