const prefix = 'non_member/order';

const state = () => ({
  orderTable: [],
  totalCount: 0,
  pageSize: 0,
  deliveryInfo: {},
  result: {},
});

const actions = {
  async getExchangeReturnOrders({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_claim_orders`, { params: query });
    await commit('setExchangeReturnOrder', res.data);
  },
  async getExchangeReturnOrderDetail(context, id) {
    const res = await this.$axios.get(`${prefix}/claim_order_product/${id}`);
    return res.data.data.order_product;
  },
  async getDeliveryInfo({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/get_delivery_info`, { params: { order_product_id: id } });
    await commit('setDeliveryInfo', res.data);
  },
  async createInquiryProduct({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/create_inquiry_product`, { params: data });
    await commit('setResult', res.data);
  },
  async setCancelOrderProductExchange({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/cancel_request_exchange`, data);
    await commit('setResult', res.data);
  },
  async setCancelOrderProductReturn({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/cancel_request_return`, data);
    await commit('setResult', res.data);
  },
  async setCancelOrderProductCancel({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/cancel_request_cancel`, data);
    await commit('setResult', res.data);
  },
  async getReason(context, data) {
    const res = await this.$axios.get(`${prefix}/get_reason`, { params: data });
    return res.data;
  },
  async patchReason({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/update_reason`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setExchangeReturnOrder(state, res) {
    state.orderTable = res.data.orders;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setDeliveryInfo(state, res) {
    state.deliveryInfo = res.data.delivery_info;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  orderTable: (state) => state.orderTable,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  deliveryInfo: (state) => state.deliveryInfo,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
