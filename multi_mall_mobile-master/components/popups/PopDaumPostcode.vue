<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap  w_l">
            <div class="popup_title text-center">주소검색</div>
            <div class="popup_text_wrap">
                @complete="complete"
            </div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
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
  data: () => ({
    params: {
      addressInfo: null,
    },
  }),
  methods: {
    // TODO 지번과 도로명 구분 바인딩
    complete(e) {
      const addressData = {};
      addressData.zonecode = e.zonecode;
      addressData.sigungu_code = e.sigunguCode;
      if (e.userSelectedType === 'R') addressData.address = e.roadAddress;
      if (e.userSelectedType === 'J') addressData.address = e.jibunAddress;
      this.params.addressInfo = addressData;
      if (this.okCallback) this.okCallback(this.params);
    },
  },
});
</script>

<style scoped>

</style>
