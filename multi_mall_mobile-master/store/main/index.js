import Utils from '@/plugins/utils';

const urlPrefix = 'main';

const state = () => ({
  businessInfo: {},
  csInfo: {},

  products: [],
  nextCursor: null,
});

const actions = {
  async getBusinessInfo({ commit }) { // 사용 : Footer.vue
    const res = await this.$axios.get(`${urlPrefix}/get_business_info`);
    await commit('setBusinessInfo', res.data.data);
    return res.data;
  },
  async getProducts({ commit }, query) {
    const config = {
      params: query,
    };
    const mainPageUid = Utils.getCookie(document.cookie, 'mainPageUid');
    if (mainPageUid) {
      config.headers = {
        'X-MAINPAGEUID': mainPageUid,
      };
    }
    const res = await this.$axios.get(`${urlPrefix}/get_price_groups`, config);
    await commit('setProductPriceGroups', res.data);
  },
};

const mutations = {
  setBusinessInfo(state, data) {
    if (data.business_info) state.businessInfo = data.business_info;
    if (data.cs_info) state.csInfo = data.cs_info;
  },
  setProductPriceGroups(state, res) {
    state.products = res.data.products;
    state.nextCursor = res.data.next_cursor;
    Utils.addCookie('mainPageUid', res.data.x_page_uid);
  },
};

const getters = {
  businessInfo: (state) => state.businessInfo,
  csInfo: (state) => state.csInfo,

  products: (state) => state.products,
  nextCursor: (state) => state.nextCursor,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
