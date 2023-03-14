const prefix = 'mypage/review';

const state = () => ({
  reviews: [],
  reviewTotalCount: 0,
  reviewPageSize: 0,

  orderProducts: [],
  orderProductTotalCount: 0,
  orderProductPageSize: 0,

  result: '',
});

const actions = {
  async getReviews({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_reviews`, { params: query });
    await commit('setReviews', res.data);
  },
  async getAvailableOrderProducts({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_available_order_products`, { params: query });
    await commit('setAvailableOrderProducts', res.data);
  },
  async createReview({ commit }, formData) {
    const res = await this.$axios.post(`${prefix}/create_review`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await commit('setResult', res.data);
  },
};

const mutations = {
  setReviews(state, res) {
    state.reviews = res.data.reviews;
    state.reviewTotalCount = res.data.totalCount;
    state.reviewPageSize = parseInt(res.data.pageSize, 10);
  },
  setAvailableOrderProducts(state, res) {
    state.orderProducts = res.data.orderProducts;
    state.orderProductTotalCount = res.data.totalCount;
    state.orderProductPageSize = parseInt(res.data.pageSize, 10);
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  reviews: (state) => state.reviews,
  reviewTotalCount: (state) => state.reviewTotalCount,
  reviewPageSize: (state) => parseInt(state.reviewPageSize, 10),

  orderProducts: (state) => state.orderProducts,
  orderProductTotalCount: (state) => state.orderProductTotalCount,
  orderProductPageSize: (state) => state.orderProductPageSize,

  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
