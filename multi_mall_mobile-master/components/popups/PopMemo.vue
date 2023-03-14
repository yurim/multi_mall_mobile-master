<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">관리자 메모</div>
            <div class="popup_text_wrap">
              <div class="color_main_01"><b>메모 입력</b></div>
              <textarea cols="30" rows="3" placeholder="내용을 입력해주세요."></textarea>
            </div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">저장</button>
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
  props: ['originMemo'],
  created() {
    this.params.adminMemo = this.originMemo;
  },
});
</script>
