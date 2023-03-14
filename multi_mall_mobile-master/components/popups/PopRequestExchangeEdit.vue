<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">교환사유 변경</div>
            <div class="popup_text_wrap text_left">

              <ul class="explain_wrap">
                <li>선택된 주문건에 대한 교환사유를 수정합니다.</li>
              </ul>

              <ul class="list_wrap w_100">
                <li>
                  <div class="title">교환요청 사유</div>
                  <div class="body">
                    <select v-model="params.reason_sub_type">
                      <option v-for="code in codeList" :value="code.value.code">{{code.value.name}}</option>
                    </select>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_10"><b>교환요청 상세 사유 ({{reasonLength}}/500자)</b></div>
                <div class="m_b_20">
                  <textarea v-model="params.reason" rows="3" placeholder="내용을 입력해주세요." :disabled="isReject"></textarea>
                </div>
              </div>

              <div v-if="isReject">
                <div class="color_main_01 m_b_10" ><b>교환거부 사유</b></div>
                <textarea rows="3" :disabled="true">{{ reject.reason }}</textarea>
              </div>

            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">{{ isReject ? '확인' : '취소' }}</button>
          <button v-if="!isReject" @click="ok">확인</button>
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
    codeList: [],
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
    this.codeList = this.codesValueArray('reason_sub_type', 'RQST_EXCHNG');
    if (!this.params.reason_sub_type) this.params.reason_sub_type = this.codeList[0].value.code;
    if (Object.keys(this.reject).length > 0) this.isReject = true;
  },
  methods: {},
});
</script>
