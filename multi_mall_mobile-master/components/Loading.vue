<template>
  <div>
    <loading
      :active="true"
      :can-cancel="true"
      :is-full-page="true"></loading>
  </div>
</template>

<script>
import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default Vue.extend({
  props: ['taskFunction'],
  components: {
    Loading,
  },
  async mounted() {
    document.querySelector('body').appendChild(this.$el);
    await this.taskFunction();
    this.destroy();
  },
  beforeDestroy() {
    document.querySelector('body').removeChild(this.$el);
    this.$emit('finishTasks');
  },
  methods: {
    destroy() {
      this.$destroy();
    },
  },
});
</script>
