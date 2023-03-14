import Utils from '@/plugins/utils';

const prefix = 'user';
const prefixNonMember = 'non_member/order';

const state = () => ({
  result: {},
  snsIds: {},
});

const actions = {
  async getUserInfo({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/login`, data);
    await commit('setUserInfo', res.data);
  },
  async getNonUserOrderInquiry({ commit }, data) {
    const res = await this.$axios.post(`${prefixNonMember}/auth_non_member`, data);
    await commit('setNonMemberToken', res.data);
    return res.data;
  },
  async getSNSClientIDs({ commit }) {
    const res = await this.$axios.get(`${prefix}/login/get_sns_client_ids`);
    await commit('setSNSClientIDs', res.data);
    return res.data;
  },
  async loginSNSUser({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/login_sns`, data);
    await commit('loginSNSUser', res.data);
    return res.data;
  },
};

const mutations = {
  setUserInfo(state, res) {
    state.result = res;
    if (res.result === 'success') {
      Utils.addCookie('jwt', res.data.token);
      Utils.removeCookie('lgn_tgt'); // LOGIN_TARGET
      Utils.removeCookie('jwtNonMember');
    }
    if (res.result === 'error') Utils.removeCookie('csrf');
  },
  setNonMemberToken(state, res) {
    if (res.result === 'success') Utils.addCookie('jwtNonMember', res.data.token);
    if (res.result === 'error') Utils.removeCookie('csrf');
  },
  setSNSClientIDs(state, res) {
    if (res.data) state.snsIds = res.data;
  },
  loginSNSUser(state, res) {
    if (res.result === 'success') {
      Utils.addCookie('jwt', res.data.token);
      Utils.addCookie('lgn_tgt', 'sns'); // LOGIN_TARGET
    }
  },
};

const getters = {
  result: (state) => state.result,
  snsIds: (state) => state.snsIds,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
