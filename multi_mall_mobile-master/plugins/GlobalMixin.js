import Vue from 'vue';

if (!Vue.__global_mixin) {
  Vue.__global_mixin = true;
  Vue.mixin({
    beforeMount() {
      if (process.client) {
        if (!window.wcs_add) window.wcs_add = {};
        if (!window.wcs_add.wa) window.wcs_add.wa = process.env.NAVER_COMMON_AUTH_KEY;
        if (window.wcs) {
          if (window.wcs_do) window.wcs_do();
          if (window.wcs.inflow) window.wcs.inflow();
        }
      }
    },
  });
}
