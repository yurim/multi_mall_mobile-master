<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="agreement">
        <div class="main_title_wrap">
          <h2>개인정보 처리 방침</h2>
        </div>
        <div class="scroll-box">
          <client-only>
            <SummernoteEditor :preview="true" :detailContent="privacyAgreement.content" />
          </client-only>
        </div>
        <div class="but_wrap">
          <a class="line_but" href="javascript:history.back() ">이전</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    privacyAgreement: {
      content: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getAgreements', ['privacy']);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    if (Object.keys(this.agreementObject('privacy')).length > 0) this.privacyAgreement.content = this.agreementObject('privacy').content;
  },
};
</script>
