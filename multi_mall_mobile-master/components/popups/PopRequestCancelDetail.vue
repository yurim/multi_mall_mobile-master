<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">취소 상세 내역</div>
            <div class="popup_text_wrap text_left">
              <ul class="list_wrap w_100">
                <li>
                  <div class="title">취소요청 사유:</div>
                  <div class="body">
                    <span>{{reason_sub_type_str}}</span>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_20"><b>취소요청 상세 사유 ({{reasonLength}}/500자)</b></div>
                <div class="m_b_20">
                  <textarea v-model="params.reason" rows="3" placeholder="내용을 입력해주세요." :disabled="true"></textarea>
                </div>
              </div>

              <div v-if="isReject">
                <div class="color_main_01 m_b_20"><b>취소거부 사유</b></div>
                <div class="m_b_20">
                  <textarea rows="3" :disabled="true">{{ reject.reason }}</textarea>
                </div>
              </div>

            </div>
          </div>

        </div>
        <div class="popup_btn_wrap">
          <button @click="cancel">확인</button>
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
  props: {
    reason_sub_type: {
      type: String,
      default: '',
    },
    reason_sub_type_str: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
    reject: {
      type: Object,
      default: {},
    },
  },
  data: (vm) => ({
    reasonSubTypeCodes: [],
    isReject: false,
    params: {
      reason_sub_type: vm.reason_sub_type,
      reason: vm.reason,
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
    if (Object.keys(this.reject).length > 0) this.isReject = true;
  },
});
</script>
