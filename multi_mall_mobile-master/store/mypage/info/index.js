const prefix = 'mypage/info';

const state = () => ({
  receptions: [],
  deliveries: [],
  userInfo: {},
  verifyResult: {},
  verifyNumber: '',
  result: {},
});

const actions = {
  async getVerifyUserInfo({ commit }, data) {
    const res = await this.$axios.post(`${prefix}`, data);
    await commit('setVerifyUserInfo', res.data);
  },
  async getSNSUserInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}/get_sns_user`);
    await commit('setVerifyUserInfo', res.data);
  },
  async getAuthNumber({ commit }, data) {
    const res = await this.$axios.get(`common/smsVerify/${data}`);
    await commit('setResult', res.data);
  },
  async patchUserPhone({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/change_pn`, data);
    await commit('setResult', res.data);
  },
  async patchUserInfo({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/update_user_info`, data);
    await commit('setResult', res.data);
  },
  async deleteUserLeave({ commit }, params) {
    const res = await this.$axios.post(`${prefix}`, params);
    await commit('setResult', res.data);
  },
  async getUserAgreedReceptions({ commit }, data) {
    const res = await this.$axios.get(`${prefix}/get_user_agreed_receptions`, data);
    await commit('setUserReceptions', res.data);
  },
};

const mutations = {
  setVerifyUserInfo(state, res) {
    state.userInfo = res.data.user;
    state.deliveries = res.data.deliveries;
    state.verifyResult.result = res.result;
    state.verifyResult.message = res.message;
  },
  setResult(state, res) {
    state.result = res;
  },
  setUserReceptions(state, res) {
    state.receptions = res.data.receptions;
  },
};

const getters = {
  userInfo: (state) => state.userInfo,
  deliveries: (state) => state.deliveries,
  receptions: (state) => state.receptions,
  verifyResult: (state) => state.verifyResult,
  verifyNumber: (state) => state.verifyNumber,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
