<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="agreement">
        <div class="main_title_wrap">
          <h2>제 3자 정보 제공</h2>
        </div>
        <div class="scroll-box">
          <client-only>
            <SummernoteEditor :preview="true" :detailContent="thirdAgreement.content" />
          </client-only>
        </div>
        <div class="but_wrap">
          <a class="line_but" href="javascript:;">이전</a>
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
    thirdAgreement: {
      content: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getAgreements', ['third']);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    if (Object.keys(this.agreementObject('third')).length > 0) this.thirdAgreement.content = this.agreementObject('third').content;
  },
};
</script>
