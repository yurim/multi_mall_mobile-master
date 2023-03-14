const prefix = 'mypage/common';

const state = () => ({
  orderCount: 0,
  currentPoint: 0,
  reviewCount: 0,
});

const actions = {
  async getSummery({ commit }) {
    const res = await this.$axios.get(`${prefix}/get_summery`);
    await commit('setSummery', res.data);
  },
};

const mutations = {
  setSummery(state, res) {
    state.orderCount = res.data.order_count;
    state.currentPoint = res.data.current_point;
    state.reviewCount = res.data.review_count;
  },
};

const getters = {
  orderCount: (state) => state.orderCount,
  currentPoint: (state) => state.currentPoint,
  reviewCount: (state) => state.reviewCount,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
