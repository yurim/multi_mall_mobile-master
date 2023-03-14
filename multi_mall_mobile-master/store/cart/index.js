const state = () => ({
  carts: [],
});

const prefix = 'cart';

const actions = {
  async get_carts({ commit }) {
    const res = await this.$axios.get(`${prefix}/get_carts`);
    await commit('setCarts', res.data.data.carts);
  },
  async get_unknown_carts({ commit }, data) {
    const res = await this.$axios.get(`${prefix}/get_unknown_carts`, { params: data });
    await commit('setCarts', res.data.data.carts);
  },
  async delete_cart(context, data) {
    return await this.$axios.put(`${prefix}/delete_cart`, data);
  },
  async check_products(context, data) {
    return await this.$axios.post(`${prefix}/check_products`, data);
  },
  async add_carts(context, data) {
    return await this.$axios.post(`${prefix}/add_carts`, data);
  },
  async update_cart(context, data) {
    return await this.$axios.post(`${prefix}/update_cart`, data);
  },
};

const mutations = {
  setCarts(state, data) {
    state.carts = data;
  },
};

const getters = {
  carts: (state) => state.carts,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
