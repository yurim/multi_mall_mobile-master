const urlPrefix = 'product';

const state = () => ({
  reviews: [],
  totalCount: 0,
  pageSize: 0,
  textReviewPoint: 0,
  photoReviewPoint: 0,

  bestReviews: [],
  bestReviewCurrPage: 0,
  bestReviewTotalCount: 0,
  bestReviewPageSize: 0,

  abroadReviews: [],
  abroadTotalCount: 0,
  abroadPageSize: 0,
});

const actions = {
  async getReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.id}/reviews`, { params: data.query });
    await commit('setReviews', res.data);
    return res.data;
  },
  async getBestReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.id}/best_photo_reviews`, { params: data.query });
    await commit('setBestReviews', res.data.data);
    return res.data;
  },
  async getAbroadReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.id}/abroad-reviews`, { params: data.query });
    await commit('setAbroadReviews', res.data);
    return res.data;
  },
};

const mutations = {
  setReviews(state, json) {
    state.reviews = json.data.reviews;
    state.totalCount = json.data.totalCount;
    state.pageSize = json.data.pageSize;
    state.textReviewPoint = json.data.textReviewPoint;
    state.photoReviewPoint = json.data.photoReviewPoint;
  },
  setBestReviews(state, data) {
    if (data.reviews.length > 0) state.bestReviewCurrPage += 1;
    state.bestReviews = state.bestReviews.concat(data.reviews);
    state.bestReviewTotalCount = data.totalCount;
    state.bestReviewPageSize = data.pageSize;
  },
  initBestReviews(state) {
    state.bestReviews = [];
    state.bestReviewCurrPage = 0;
  },
  setAbroadReviews(state, json) {
    state.abroadReviews = json.data.reviews;
    state.abroadTotalCount = json.data.total_count;
    state.abroadPageSize = json.data.page_size;
  },
};

const getters = {
  reviews: (state) => state.reviews,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  textReviewPoint: (state) => state.textReviewPoint,
  photoReviewPoint: (state) => state.photoReviewPoint,
  bestReviews: (state) => state.bestReviews,
  bestReviewCurrPage: (state) => state.bestReviewCurrPage,
  bestReviewTotalCount: (state) => state.bestReviewTotalCount,
  bestReviewPageSize: (state) => parseInt(state.bestReviewPageSize, 10),
  abroadReviews: (state) => state.abroadReviews,
  abroadTotalCount: (state) => state.abroadTotalCount,
  abroadPageSize: (state) => parseInt(state.abroadPageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
