import Utils from '@/plugins/utils';

const prefix = 'user/regist';

const state = () => ({
  agreements: [],
  result: '',
});

const actions = {
  async getAgreements({ commit }) {
    const res = await this.$axios.get(`${prefix}/get_agreements`);
    await commit('setAgreements', res.data);
  },
  async createSNSUser({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/create_sns`, data);
    await commit('setResult', res.data);
  },
  async sendSMSAuth(context, data) {
    const res = await this.$axios.post(`${prefix}/send_sms_auth`, data);
    return res.data;
  },
  async verifySMSAuth(context, data) {
    const res = await this.$axios.post(`${prefix}/verify_sms_auth`, data);
    return res.data;
  },
};

const mutations = {
  setAgreements(state, res) {
    state.agreements = res.data.agreements;
  },
  setResult(state, res) {
    state.result = res;
    if (res.result === 'success' && res.data.token) {
      Utils.addCookie('jwt', res.data.token);
      Utils.removeCookie('lgn_tgt'); // LOGIN_TARGET
      Utils.removeCookie('jwtNonMember');
    }
    if (res.result === 'error') Utils.removeCookie('csrf');
  },
};

const getters = {
  agreements: (state) => state.agreements,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
