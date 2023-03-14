const prefix = 'non_member/order';

const state = () => ({
  orderProduct: {},
  result: {},
});

const actions = {
  async getClaimOrderProduct({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/claim_order_product/${id}`);
    await commit('setClaimOrderProduct', res.data);
  },
  async setOrderProductReturn({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/set_return`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setClaimOrderProduct(state, res) {
    state.orderProduct = res.data.order_product;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  orderProduct: (state) => state.orderProduct,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
