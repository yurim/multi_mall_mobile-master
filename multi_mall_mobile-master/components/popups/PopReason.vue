<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">title</div>
            <div class="popup_text_wrap">
              <div class="color_main_01"><b>사유 입력</b></div>
              <div>
                <textarea rows="3" placeholder="내용을 입력해주세요."></textarea>
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
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  methods: {},
  props: ['reason'],
  data(vm) {
    return {
      params: {
        reason: vm.reason,
      },
    };
  },
});
</script>
