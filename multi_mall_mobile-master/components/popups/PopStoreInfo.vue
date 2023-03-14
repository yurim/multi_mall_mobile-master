<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">

        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center font_20">{{ title }}</div>
            <div class="popup_text_wrap text_left">
              <div class="bold p_l_10 m_b_10">사업자 등록번호 : <span class="color_main_01 font_nomal">{{ storeInfo.license_num }}</span></div>
              <div class="bold p_l_10">상호명 : <span class="color_main_01 font_nomal">{{ storeInfo.company_name }}</span></div>
              <div class="bold p_l_10">대표자명 : <span class="color_main_01 font_nomal">{{ storeInfo.ceo_name }}</span></div>
              <div class="bold p_l_10">전화번호 : <span class="color_main_01 font_nomal">{{ storeInfo.phone }}</span></div>
              <div class="bold p_l_10">이메일 : <span class="color_main_01 font_nomal">{{ storeInfo.email }}</span></div>
              <div class="bold p_l_10">통신판매업신고번호 : <span class="color_main_01 font_nomal">{{ storeInfo.sale_num }}</span></div>
              <div class="bold p_l_10">주소 : <span class="color_main_01 font_nomal">({{ storeInfo.zipcode }}) {{ storeInfo.address }} {{ storeInfo.detail_address }}</span></div>
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
  props: {
    storeInfo: {
      type: Object,
      default: () => {},
    },
  },
  methods: {},
});
</script>
