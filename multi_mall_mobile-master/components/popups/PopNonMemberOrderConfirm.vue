<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="terms_popup_wrap">
            <div class="popup_wrap">
              <div class="popup_title">{{ title }}</div>
              <div class="popup_text_wrap" v-html="message">
              </div>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel">동의하지 않음</button>
          <button @click="ok">동의</button>
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
