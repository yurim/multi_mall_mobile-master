const state = () => ({
  codes: {},
  codesValue: {},
  agreements: {},
});

const actions = {
  async getCodes({ state, commit }, codeGroupList) {
    if (typeof state.codes[codeGroupList] !== 'undefined') return;
    if (typeof codeGroupList !== 'object') codeGroupList = [codeGroupList];
    const res = await this.$axios.get('common/codes', {
      params: {
        code_group_list: codeGroupList,
      },
    });

    await commit('setCodes', {
      codeGroupList,
      codes: res.data.data.commonCodes,
    });
  },
  async getCodesValue({ state, commit }, codeGroupList) {
    if (typeof state.codesValue[codeGroupList] !== 'undefined') return;
    if (typeof codeGroupList !== 'object') codeGroupList = [codeGroupList];
    const res = await this.$axios.get('common/codes_value', {
      params: {
        code_group_list: codeGroupList,
      },
    });

    await commit('setCodesValue', {
      codeGroupList,
      codes: res.data.data.commonCodes,
    });
  },

  async getAgreements({ state, commit }, agreementTypeList) {
    if (typeof state.agreements[agreementTypeList] !== 'undefined') return;
    if (typeof agreementTypeList !== 'object') agreementTypeList = [agreementTypeList];
    const res = await this.$axios.get('common/agreements', {
      params: {
        agreement_type_list: agreementTypeList,
      },
    });

    await commit('setAgreements', {
      agreementTypeList,
      agreements: res.data.data.agreements,
    });
  },
};

const mutations = {
  setCodes(state, data) {
    data.codeGroupList.forEach((codeGroup) => {
      state.codes[codeGroup] = data.codes[codeGroup];
    });
  },
  setCodesValue(state, data) {
    data.codeGroupList.forEach((codeGroup) => {
      state.codesValue[codeGroup] = data.codes[codeGroup];
    });
  },
  setAgreements(state, data) {
    data.agreementTypeList.forEach((agreementType) => {
      state.agreements[agreementType] = data.agreements.find((agreement) => agreement.agreement_type === agreementType.toUpperCase());
    });
  },
};

const getters = {
  codesObject: (state) => (codeGroup) => {
    if (!state.codes[codeGroup]) return {};
    return state.codes[codeGroup];
  },
  codesArray: (state) => (codeGroup) => {
    if (!state.codes[codeGroup]) return [];
    return Object.entries(state.codes[codeGroup]).map((v) => ({ key: v[0], value: v[1] }));
  },
  codesValueArray: (state) => (codeGroup, value) => {
    if (!state.codesValue[codeGroup]) return [];
    return Object.entries(state.codesValue[codeGroup])
      .filter((v) => v[1].value === value)
      .map((v) => ({ key: v[0], value: v[1] }));
  },
  codeValueObjectArray: (state) => (codeGroup) => {
    if (!state.codesValue[codeGroup]) return {};
    return Object.values(state.codesValue[codeGroup]);
  },
  agreementObject: (state) => (agreementType) => {
    if (!state.agreements[agreementType]) return {};
    return state.agreements[agreementType];
  },
  filteredCode: (state) => (codeGroup, code) => {
    if (!state.codesValue[codeGroup]) return [];
    return Object.entries(state.codesValue[codeGroup])
      .filter((v) => v[1].code === code)
      .map((v) => (v[1]))[0];
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
