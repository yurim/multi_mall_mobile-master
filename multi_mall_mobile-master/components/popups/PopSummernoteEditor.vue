<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title"> template.name</div>
            <div class="popup_text_wrap">
              <div class="editor_show_wrap">
                  SummernoteEditor :preview="true" summernoteId="popEditor" :detailContent="template.content" :detailImageArr="template.images"
              </div>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
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
  props: {
    template: {
      type: Object,
      default: null,
    },
  },
});
</script>
