<template>
    <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">title</div>
            <div class="input_file_wrap m_t_20 m_b_10">
              <div class="file_name">
                <template>fileName</template>
                <template>파일 업로드</template>
              </div>
              <input type="file" id="inputFile" ref="inputFile"/>
              <label for="inputFile">파일 업로드</label>
            </div>
          </div>

        </div>
        <div class="popup_btn_wrap">
          <button @click="ok">일괄등록</button>
          <button @click="cancel">취소</button>
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
    checkFile: {
      type: Function,
      default: () => true,
    },
  },
  data: () => ({
    params: {
      file: null,
    },
    fileName: null,
  }),
  methods: {
    clickFileName() {
      this.$refs.inputFile.click();
    },
    setInputFile(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        const excelFile = files[0];
        if (this.checkFile(excelFile)) {
          const reader = new FileReader();
          reader.readAsDataURL(excelFile);
          reader.onload = () => {
            this.fileName = excelFile.name;
            this.params.file = excelFile;
          };
        }
      }
    },
  },
});
</script>

<style scoped>

</style>
