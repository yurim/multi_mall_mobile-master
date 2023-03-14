const prefix = 'user/store/request/info';

const state = () => ({
  result: '',
  categories: [],
});

const actions = {
  async createEnterRequest({ commit }, data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      let value = data[key];
      if (!(value instanceof File) && typeof value === 'object') value = JSON.stringify(value);
      formData.append(key, value);
    });

    const res = await this.$axios.post(`${prefix}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await commit('setResult', res.data);
  },
  async getCategories({ commit }) {
    const res = await this.$axios.get('user/store/request/category');
    await commit('setCategories', res.data);
  },
};

const mutations = {
  setResult(state, res) {
    state.result = res;
  },
  setCategories(state, res) {
    state.categories = res.data.categories;
  },
};

const getters = {
  result: (state) => state.result,
  categories: (state) => state.categories,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
