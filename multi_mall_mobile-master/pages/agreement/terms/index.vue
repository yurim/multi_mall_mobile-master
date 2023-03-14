<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="agreement">
        <div class="main_title_wrap">
          <h2>이용약관</h2>
        </div>
        <div class="scroll-box">
          <client-only>
            <SummernoteEditor :preview="true" :detailContent="termsAgreement.content" />
          </client-only>
        </div>
        <div class="but_wrap">
          <a class="line_but" href="javascript:history.back()">이전</a>
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
    termsAgreement: {
      content: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getAgreements', ['terms']);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    if (Object.keys(this.agreementObject('terms')).length > 0) this.termsAgreement.content = this.agreementObject('terms').content;
  },
};
</script>
