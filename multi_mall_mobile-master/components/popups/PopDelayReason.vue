<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">지연 사유</div>
            <div class="popup_text_wrap">

              <div>
                <div class="m_b_20">
                  <textarea v-model="params.reason" rows="3" :disabled="true"></textarea>
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
  },
  data: (vm) => ({
    reasonSubTypeCodes: [],
    params: {
      reason_sub_type: vm.reason_sub_type,
      reason: vm.reason,
    },
  }),
});
</script>
