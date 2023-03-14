export default {
  data: () => ({
    selperIntv: null,
  }),
  mounted() {
    if (this.$selperMode.indexOf(this.$nodeEnv) > -1) {
      this.initSelperCommon();
    }
  },
  destroyed() {
    clearInterval(this.intv);
  },
  methods: {
    initSelperCommon() {
      this.intv = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (__trackSelperPageView) {
          // eslint-disable-next-line no-undef
          __trackSelperPageView();
          clearInterval(this.intv);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(this.intv);
      }, 5000);
    },
  },
};
