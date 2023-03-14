const prefix = 'mypage/point';

const state = () => ({
  usingHistory: [],
  totalCount: 0,
  pageSize: 0,
  current_point: 0,
});

const actions = {
  async getUsingHistory({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_point_usings`, { params: query });
    await commit('setUsingHistory', res.data);
  },
  async getCurrentPoint({ commit }) {
    const res = await this.$axios.get(`${prefix}/get_current_point`);
    await commit('setCurrentPoint', res.data.data);
    return res.data;
  },
};

const mutations = {
  setUsingHistory(state, res) {
    state.usingHistory = res.data.points;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setCurrentPoint(state, data) {
    if (data.current_point) state.current_point = data.current_point;
  },
};

const getters = {
  usingHistory: (state) => state.usingHistory,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  current_point: (state) => state.current_point,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
