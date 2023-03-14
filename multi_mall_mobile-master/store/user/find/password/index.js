const prefix = 'forgot/password';

const state = () => ({
  result: '',
});

const actions = {
  async getVerifyNumber({ commit }, data) {
    const res = await this.$axios.get(`common/smsVerify/${data}`);
    await commit('setResult', res.data);
  },
  async getFindPassword(context, data) {
    const res = await this.$axios.post(`${prefix}`, data);
    return res.data;
  },
  async patchUserPassword({ commit }, data) {
    const res = await this.$axios.put(`${prefix}/update`, data);
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
