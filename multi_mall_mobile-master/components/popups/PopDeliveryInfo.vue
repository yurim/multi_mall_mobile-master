<template>
  <!--  배송정보 팝업창-->
  <div class="popup-mask">
    <div class="popup-wrapper">
      <div class="popup-container">
        <div class="info_popup_wrap">
          <div class="main_title">배송 정보</div>
          <div class="info_group">
            <ul>
              <li>
                <div class="status_name">보내는곳</div>
                <div class="status_info">{{ info.store.store_name_kor }}</div>
              </li>
              <li>
                <div class="status_name">수령인</div>
                <div class="status_info">{{ info.deliveryInfo.name }}</div>
              </li>
              <li>
                <div class="status_name">주소</div>
                <div class="status_info">[{{ info.deliveryInfo.zipcode }}] {{ info.deliveryInfo.address }} {{ info.deliveryInfo.detail_address }}</div>
              </li>
              <li>
                <div class="status_name">상품 정보</div>
                <div class="status_info">{{ info.product.product_name }} [{{ info.product.product_option_names }}] {{ info.product.amount | comma }}개</div>
              </li>
              <template v-if="info.deliveryInfo.delivery_method === 'PARCEL'">
                <li v-if="info.deliveryInfo.delivery_method === 'PARCEL'">
                  <div class="status_name">택배사</div>
                  <div class="status_info">{{ info.deliveryInfo.delivery_company_str }}</div>
                </li>
                <li>
                  <div class="status_name">운송장번호</div>
                  <div class="status_info">{{ info.deliveryInfo.invoice_num }} <a class="brand_color" :href="info.deliveryInfo.tracking_url" target="_blank">[운송장 조회]</a></div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>

      <div class="popup_btn_wrap">
        <button class="line_btn" @click="cancel">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  created() {
  },
  methods: {},
});
</script>
