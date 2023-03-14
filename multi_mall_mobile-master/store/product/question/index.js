const urlPrefix = 'product';

const state = () => ({
  questions: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getQuestions({ commit }, data) {
    const res = await this.$axios.get(`${urlPrefix}/${data.id}/questions`, { params: data.query });
    await commit('setQuestions', res.data);
    return res.data;
  },
  async deleteQuestion(content, data) {
    return await this.$axios.put(`${urlPrefix}/${data.product_id}/questions/delete`, data.params);
  },
  async createQuestion(content, data) {
    return await this.$axios.post(`${urlPrefix}/${data.product_id}/questions/create`, data.params);
  },
  async addQuestion(content, data) {
    return await this.$axios.post(`${urlPrefix}/${data.product_id}/questions/create_additional`, data.params);
  },
  async updateQuestion(content, data) {
    return await this.$axios.put(`${urlPrefix}/${data.product_id}/questions/update`, data.params);
  },
};

const mutations = {
  setQuestions(state, json) {
    state.questions = json.data.questions;
    state.totalCount = json.data.totalCount;
    state.pageSize = json.data.pageSize;
  },
};

const getters = {
  questions: (state) => state.questions,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
