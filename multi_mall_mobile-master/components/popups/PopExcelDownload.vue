<template>
    <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">message</div>
            <div class="popup_text_wrap">
              <div class="color_main_01"><b>단위선택</b></div>
              <div>
                <select>
                  <option>size</option>
                </select>
              </div>
            </div>
            <div class="popup_text_wrap">
              <div class="color_main_01"><b>범위선택</b></div>
              <div>
                <select>
                  <option>boundaryPage(inPage)</option>
                </select>
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
  props: {
    totalCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    params: {
      page: 1,
      pageSize: 50,
    },
    pageSizeList: [50, 100, 500, 1000],
    pageList: [],
  }),
  mounted() {
    this.setPageList();
  },
  methods: {
    boundaryPage(page) {
      return `${this.params.pageSize * (page - 1) + 1} ~ ${this.pageList.length === page ? this.totalCount : this.params.pageSize * page}`;
    },
    setPageList() {
      const pageList = [];
      const length = Math.ceil(this.totalCount / this.params.pageSize);
      for (let i = 0; i < length; i += 1) {
        pageList.push(i + 1);
      }
      this.pageList = pageList;
    },
    changePageSize(e) {
      const select = e.target;
      this.params.pageSize = select.options[select.selectedIndex].value;
    },
    setParams(e) {
      const select = e.target;
      this.params.page = select.options[select.selectedIndex].value;
    },
  },
});
</script>

<style scoped>

</style>
