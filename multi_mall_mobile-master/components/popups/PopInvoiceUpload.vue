<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">송장정보 일괄등록</div>
            <div class="popup_text_wrap">
              <div class="file_name_input_wrap w_100 m_b_20">
                <div>파일명.xl</div>
                <input type="file" id="file_test">
                <label for="file_test">첨부파일 등록</label>
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
});
</script>
