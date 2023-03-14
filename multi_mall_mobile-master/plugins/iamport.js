import Vue from 'vue';
import IMP from 'vue-iamport';

Vue.use(IMP, process.env.IAMPORT_IMP);
Vue.IMP().load();

export default IMP;
