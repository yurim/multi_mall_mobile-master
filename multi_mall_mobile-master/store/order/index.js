const state = () => ({
  order_infos: [],
  deliveries: [],
  delivery: {},
  user: {},
});

const prefix = 'order';

const actions = {
  async get_order_infos(context, data) {
    const res = await this.$axios.get(`${prefix}/get_order_infos`, { params: data });
    await context.commit('setOrderInfos', res.data.data.order_infos);
  },
  async get_deliveries(context, data) {
    const res = await this.$axios.get(`${prefix}/get_deliveries`, { params: data });
    if (res.data.result !== 'error') {
      const deliveries = res.data.data.deliveries;
      await context.commit('setDeliveries', deliveries);
      await context.commit('setUser', res.data.data.user);
      if (deliveries.length > 0) await context.commit('setDelivery', deliveries[0]);
    }
    return res;
  },
  async create_delivery(context, data) {
    return await this.$axios.post(`${prefix}/create_delivery`, data);
  },
  async update_delivery(context, data) {
    return await this.$axios.put(`${prefix}/update_delivery`, data);
  },
  async delete_delivery(context, data) {
    return await this.$axios.put(`${prefix}/delete_delivery`, data);
  },
  async send_sms(context, data) {
    return await this.$axios.post(`${prefix}/send_sms`, data);
  },
  async check_sms(context, data) {
    return await this.$axios.post(`${prefix}/check_sms`, data);
  },
  async create_temp_order(context, data) {
    return await this.$axios.post(`${prefix}/create_temp_order`, data);
  },
  async complete_payment(context, data) {
    return await this.$axios.post(`${prefix}/complete_payment`, data);
  },
  async create_naver_temp_order(context, data) {
    return await this.$axios.post(`${prefix}/create_naver_temp_order`, data);
  },
  async check_order_completed(context, data) {
    return await this.$axios.get(`${prefix}/check_order_completed`, { params: data });
  },
};

const mutations = {
  setOrderInfos(state, data) {
    state.order_infos = data;
  },
  setDeliveries(state, data) {
    state.deliveries = data;
  },
  setDelivery(state, data) {
    state.delivery = JSON.parse(JSON.stringify(data));
  },
  setUser(state, data) {
    state.user = data;
  },
  clear(state) {
    state.order_infos = [];
    state.deliveries = [];
    state.delivery = {};
    state.user = {};
  },
};

const getters = {
  order_infos: (state) => state.order_infos,
  deliveries: (state) => state.deliveries,
  delivery: (state) => state.delivery,
  user: (state) => state.user,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
