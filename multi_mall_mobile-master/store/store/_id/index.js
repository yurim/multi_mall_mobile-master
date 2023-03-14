const prefix = 'user/store';

const state = () => ({
  store: {},
  products: [],
  nextCursor: null,
});

const actions = {
  async getStore({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setStore', res.data);
  },
  async getProducts({ commit }, data) {
    const res = await this.$axios.get(`${prefix}/${data.id}/products`, { params: data.query });
    await commit('setProducts', res.data);
  },
  async initNextCursor({ commit }) {
    await commit('setNextCursor', null);
  },
};

const mutations = {
  setStore(state, res) {
    state.store = res.data.store;
  },
  setProducts(state, res) {
    state.products = res.data.list;
    state.nextCursor = res.data.nextCursor;
  },
  setNextCursor(state, value) {
    state.nextCursor = value;
  },
};

const getters = {
  store: (state) => state.store,
  products: (state) => state.products,
  nextCursor: (state) => state.nextCursor,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
