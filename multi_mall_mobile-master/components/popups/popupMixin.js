export default {
  props: ['title', 'subTitle', 'message', 'okCallback', 'cancelCallback', 'closeCallback'],
  data() {
    return {
      params: {
        $destroy: () => (this.$destroy()),
      },
    };
  },
  computed: {
    $store: () => (window.$nuxt.$store),
  },
  created() {
    this.$vuetify = window.$nuxt.$vuetify;
  },
  mounted() {
    document.querySelector('body').appendChild(this.$el);
  },
  beforeDestroy() {
    document.querySelector('body').removeChild(this.$el);
    if (this.closeCallback) this.closeCallback();
  },
  methods: {
    async ok() {
      if (this.okCallback) await this.okCallback(this.params);
    },
    cancel() {
      if (this.cancelCallback) this.cancelCallback(this.params);
      this.$destroy();
    },
  },
};
