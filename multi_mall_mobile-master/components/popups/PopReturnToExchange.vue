<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">교환으로 변경</div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap">
                <li>선택된 주문건을 교환으로 변경합니다. 변경후에는 교환관리탭에서 관리가 가능합니다.</li>
              </ul>

              <ul class="list_wrap">
                <li>
                  <div class="title">교환 수거방법</div>
                  <template>
                    <div class="radio_wrap">
                      <input type="radio" name="collectDelivery">
                      <label> code.value.name</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">교환비 지불방법</div>
                  <template>
                    <div class="radio_wrap">
                      <input type="radio" name="collectFee">
                      <label> code.value.name</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">교환사유</div>
                  <div class="body">
                    <select class="w_100">
                      <option>code.value.name</option>
                    </select>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_10"><b>교환 상세 사유 (0/500자)</b></div>
                <div class="m_b_20">
                  <textarea rows="3" placeholder="내용을 입력해주세요."></textarea>
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
    params: {
      collect_delivery_type: null,
      collect_fee_type: null,
      reason_sub_type: '',
      reason: '',
    },
    reasonList: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
  }),
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type']);
    this.reasonList = this.codesValueArray('reason_sub_type', 'RQST_EXCHNG');
    this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
    this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'EXCHNG');
    this.params.reason_sub_type = this.reasonList[0].value.code;
  },
});
</script>
