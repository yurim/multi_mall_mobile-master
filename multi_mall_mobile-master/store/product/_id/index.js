const urlPrefix = 'product';

const state = () => ({
  product: {},
});

const actions = {
  async getProduct({ commit }, id) {
    const res = await this.$axios.get(`${urlPrefix}/${id}`);
    await commit('setProduct', res.data.data);
    return res.data;
  },
};

const mutations = {
  setProduct(state, data) {
    if (data.product) state.product = data.product;
  },
};

const getters = {
  product: (state) => state.product,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
