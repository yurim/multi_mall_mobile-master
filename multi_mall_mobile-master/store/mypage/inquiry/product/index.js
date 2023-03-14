const prefix = 'mypage/inquiry/product';

const state = () => ({
  productInquiryList: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getProductInquiryList({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_inquiry`, { params: query });
    await commit('setProductInquiryList', res.data);
  },
  async deleteInquiry(content, query) {
    return await this.$axios.put(`${prefix}/delete_inquiry`, query);
  },
};

const mutations = {
  setProductInquiryList(state, res) {
    if (res.data.questions) state.productInquiryList = res.data.questions;
    if (res.data.totalCount) state.totalCount = res.data.totalCount;
    if (res.data.pageSize) state.pageSize = res.data.pageSize;
  },
};

const getters = {
  productInquiryList: (state) => state.productInquiryList,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
