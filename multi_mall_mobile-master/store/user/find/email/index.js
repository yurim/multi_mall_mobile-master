const prefix = 'forgot/email';

const state = () => ({
  result: {},
});

const actions = {
  async getCode({ commit }, data) {
    const res = await this.$axios.get(`common/smsVerify/${data}`);
    await commit('setResult', res.data);
  },
  async getFindEamil({ commit }, data) {
    const res = await this.$axios.post(`${prefix}`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
