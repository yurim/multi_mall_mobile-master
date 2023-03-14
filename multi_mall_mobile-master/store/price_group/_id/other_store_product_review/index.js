const urlPrefix = 'price_group';

const state = () => ({
  reviews: [],
  abroadReviews: [],
  resPhotoReview: {
    target: 'default', // default(국내리뷰), abroad(해외리뷰)
    reviews: [],
    totalCount: 0,
    pageSize: 0,
    nextCursor: null,
  },
  productScores: [],
});

const actions = {
  async getOtherProductReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.groupId}/other-product-reviews`, { params: data.query });
    await commit('setOtherProductReviews', res.data.data);
    return res.data;
  },
  async getOtherProductPhotoReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.groupId}/other-product-reviews/photo`, { params: data.query });
    await commit('setOtherProductPhotoReviews', res.data.data);
    return res.data;
  },
  async getOtherProductPhotoAbroadReviews({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.groupId}/other-product-reviews/abroad-photo`, { params: data.query });
    await commit('setOtherProductPhotoAbroadReviews', res.data.data);
    return res.data;
  },
  async getOtherProductScores({ commit }, id) {
    const res = await this.$axios.get(`${urlPrefix}/${id}/other-product-scores`);
    await commit('setOtherProductScores', res.data.data);
    return res.data;
  },
};

const mutations = {
  setOtherProductReviews(state, data) {
    if (data.reviews) state.reviews = data.reviews;
    if (data.abroad_reviews) state.abroadReviews = data.abroad_reviews;
  },
  setOtherProductPhotoReviews(state, data) {
    state.resPhotoReview.target = 'default';
    if (data.reviews) state.resPhotoReview.reviews = data.reviews;
    else state.resPhotoReview.reviews = [];
    if (data.total_count) state.resPhotoReview.totalCount = data.total_count;
    if (data.page_size) state.resPhotoReview.pageSize = data.page_size;
  },
  setOtherProductPhotoAbroadReviews(state, data) {
    state.resPhotoReview.target = 'abroad';
    if (data.reviews) state.resPhotoReview.reviews = data.reviews;
    else state.resPhotoReview.reviews = [];
    if (data.total_count) state.resPhotoReview.totalCount = data.total_count;
    if (data.page_size) state.resPhotoReview.pageSize = data.page_size;
    if (data.next_cursor) state.resPhotoReview.nextCursor = data.next_cursor;
    else state.resPhotoReview.nextCursor = null;
  },
  setOtherProductScores(state, data) {
    if (data.product_scores) state.productScores = data.product_scores;
  },
  updateResPhotoReviewTarget(state, target) {
    state.resPhotoReview.target = target;
  },
  updateGroupProductPage(state, data) {
    state.groupProductPage = data.page;
    state.groupProductPageSize = data.pageSize;
  },
};

const getters = {
  reviews: (state) => state.reviews,
  abroadReviews: (state) => state.abroadReviews,
  resPhotoReview: (state) => state.resPhotoReview,
  productScores: (state) => state.productScores,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
