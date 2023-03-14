<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title"> title</div>
            <div class="popup_text_wrap">
              <div class="editor_show_wrap">
                 contents
              </div>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="ok">닫기</button>
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
    contents: {
      type: String,
      default: '',
    },
  },
  methods: {},
});
</script>
