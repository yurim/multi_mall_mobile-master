const prefix = 'price_group';

const state = () => ({
  products: [],
  categoryTree: [],
  childCategories: [],
  nextCursor: null,
  totalCount: null,
});

const actions = {
  async getProducts({ commit }, query) {
    try {
      const res = await this.$axios.get(prefix, { params: query });
      await commit('setProducts', res.data);
    } catch (e) {
      console.log(e);
    }
  },
  async initNextCursor({ commit }) {
    await commit('setNextCursor', null);
  },
};

const mutations = {
  setProducts(state, res) {
    state.products = res.data.products;
    state.categoryTree = res.data.category_tree;
    state.childCategories = res.data.child_categories;
    state.nextCursor = res.data.next_cursor;
    state.totalCount = res.data.total_count;
  },
  setNextCursor(state, value) {
    state.nextCursor = value;
  },
};

const getters = {
  products: (state) => state.products,
  categoryTree: (state) => state.categoryTree,
  childCategories: (state) => state.childCategories,
  nextCursor: (state) => state.nextCursor,
  totalCount: (state) => state.totalCount,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
