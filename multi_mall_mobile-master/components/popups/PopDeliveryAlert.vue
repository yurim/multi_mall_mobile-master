<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_text_wrap">
              <ul class="explain_wrap text-center">
                <li>배송비 템플릿이 존재하지 않습니다.</li>
                <li>상품을 등록하기전에 배송비템플릿을 먼저 등록해주시기 바랍니다.</li>
                <li class="color_main_01">(묶음배송비도 필요시 사전설정이 필요합니다.)</li>
              </ul>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="ok">배송비템플릿 등록하기</button>
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
