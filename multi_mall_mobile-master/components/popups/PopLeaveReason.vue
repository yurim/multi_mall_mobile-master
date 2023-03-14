<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">정말 회원 탈퇴하시겠습니까?</div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">확인</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    leaveType: [],
    params: {
      leave_type: '',
      reason: '',
    },
  }),
  async created() {
    if (this.leaveType.length === 0) {
      await this.$store.dispatch('common/getCodes', 'leave_type');
      this.leaveType = this.codesArray('leave_type');
    }
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
});
</script>
