const prefix = 'user/store';

const state = () => ({
  stores: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getStores({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setStores', res.data);
  },
};

const mutations = {
  setStores(state, res) {
    state.stores = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
};

const getters = {
  stores: (state) => state.stores,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
