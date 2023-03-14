<template>
  <client-only>
  <v-app light>
    <Nuxt keep-alive :keep-alive-props="{
      include: ['mobile-main', 'mobile-store-id', 'mobile-price-group', 'mobile-price-group-search']}" />
  </v-app>
  </client-only>
</template>
<script>
import packageJson from '@/package.json';
import Popup from '@/components/popups/popup';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');

export default {
  head() {
    return {
      title: 'Molly',
    };
  },
  data() {
    return {
      nodeEnv: process.env.NODE_ENV,
      deployTarget: process.env.DEPLOY_TARGET,
    };
  },
  created() {
    const test = this.nodeEnv;
    const deployTarget = this.deployTarget;
    console.log(`Molly_${deployTarget}_${test} [ v${packageJson.version} ]`);
  },
  mounted() {
    // 페이지 접속 시 팝업
    // const checkAdmin = this.$route.name.indexOf('admin');
    // if (checkAdmin < 0) this.showEventPopup();
  },
  methods: {
    showEventPopup() {
      const expiredDate = localStorage.getItem('eventNoMoreToday');
      if (expiredDate) {
        const today = moment().format('YYYY-MM-DD');
        const expired = moment(expiredDate).format('YYYY-MM-DD');
        const flag = moment(today).isAfter(expired);
        if (!flag) return;
      }

      new Popup.EventInfo().$mount();
    },
  },
};
</script>
