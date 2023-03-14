const prefix = 'mypage/order';

const state = () => ({
  orderProduct: {},
  deliveryInfo: {},
  result: {},
});

const actions = {
  async getClaimOrderProduct({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/claim_order_product/${id}`);
    await commit('setClaimOrderProduct', res.data);
  },
  async getDeliveryInfo({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/get_delivery_info`, { params: { order_product_id: id } });
    await commit('setDeliveryInfo', res.data);
  },
  async setOrderProductReturn({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/set_return`, data);
    await commit('setResult', res.data);
  },
  async createReviewWrite({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/create_review`, { params: data });
    await commit('setResult', res.data);
  },
  async createInquiryProduct({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/create_inquiry_product`, { params: data });
    await commit('setResult', res.data);
  },
  async setDecidePurchase({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/set_decide_purchase`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setClaimOrderProduct(state, res) {
    state.orderProduct = res.data.order_product;
  },
  setDeliveryInfo(state, res) {
    state.deliveryInfo = res.data.delivery_info;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  orderProduct: (state) => state.orderProduct,
  deliveryInfo: (state) => state.deliveryInfo,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
