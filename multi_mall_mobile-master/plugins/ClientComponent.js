import Vue from 'vue';
import MultiSelect from 'vue-multiselect';
import VueDaumPostcode from 'vue-daum-postcode';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueScrollactive from 'vue-scrollactive';
import vueSelect from 'vue-select';

import VueLoading from '@/components/Loading';
import Popup from '~/components/popups/popup';

Vue.prototype.$popup = Popup;
Vue.prototype.$createLoading = (taskFunction) => new Promise((resolve) => {
  new VueLoading({
    propsData: {
      taskFunction,
    },
    created() {
      this.$on('finishTasks', () => {
        resolve();
      });
    },
  }).$mount();
});

Vue.use(VueDaumPostcode);
Vue.use(VueAwesomeSwiper);
Vue.use(VueScrollactive);

Vue.component('MultiSelect', MultiSelect);
Vue.component('vueSelect', vueSelect);
