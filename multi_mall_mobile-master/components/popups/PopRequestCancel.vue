<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">취소 사유 입력</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap w_100">
                <li>
                  <div class="title">취소요청 사유</div>
                  <div class="body">
                    <select>
                      <option>code.value.name</option>
                    </select>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_10"><b>취소요청 사유 (reasonLength/500자)</b></div>
                <div class="m_b_20">
                  <textarea v-model="params.reason" rows="3" placeholder="내용을 입력해주세요."></textarea>
                </div>
              </div>

            </div>
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
    reasonSubTypeCodes: [],
    params: {
      reason_sub_type: null,
      reason: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
    reasonLength() {
      return this.params.reason.length;
    },
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type']);
    this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_CNCL');
    this.params.reason_sub_type = this.reasonSubTypeCodes[0].value.code;
  },
});
</script>
