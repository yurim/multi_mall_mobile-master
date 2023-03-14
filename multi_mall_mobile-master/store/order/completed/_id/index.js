const urlPrefix = 'order/completed';

const state = () => ({
  order: null,
  orderProducts: [],
  isMember: false,
});

const actions = {
  async getMemberOrder({ commit }, id) {
    const res = await this.$axios.get(`${urlPrefix}/${id}`);
    await commit('setOrder', res.data.data);
    return res.data;
  },
  async getNonMemberOrder({ commit }, id) {
    const res = await this.$axios.get(`non_member/${urlPrefix}/${id}`);
    await commit('setOrder', res.data.data);
    return res.data;
  },
};

const mutations = {
  setOrder(state, data) {
    if (data.order) state.order = data.order;
    if (data.order_products) state.orderProducts = data.order_products;
  },
  setIsMember(state, data) {
    if (data) state.isMember = data;
  },
};

const getters = {
  order: (state) => state.order,
  orderProducts: (state) => state.orderProducts,
  isMember: (state) => state.isMember,
};
export default {
  state,
  actions,
  mutations,
  getters,
};
