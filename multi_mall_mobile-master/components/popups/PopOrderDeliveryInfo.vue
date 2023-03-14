<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">주소입력</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">수취인명 :</div>
                  <div class="body">
                    <input type="text" placeholder="이름"/>
                  </div>
                </li>
                <li>
                  <div class="title">수취인 연락처 :</div>
                  <div class="body">
                    <input type="text" placeholder="연락처"/>
                  </div>
                </li>
                <li>
                  <div class="title">배송지 주소 :</div>
                  <div class="body">
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호"/>
                      <a href="javascript:;">우편번호</a>
                      <input type="text" placeholder="주소"/>
                      <input type="text" placeholder="상세주소"/>
                    </div>
                  </div>
                </li>
              </ul>
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
// 배송지 정보 수정
import Vue from 'vue';
import PopupMixin from './popupMixin';
import DaumPostcode from './PopDaumPostcode';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    params: {
      name: '',
      phone: '',
      zipcode: '',
      address: '',
      detailAddress: '',
    },
  }),
  methods: {
    btnAddress() {
      const that = this;
      new DaumPostcode({
        propsData: {
          okCallback(params) {
            that.params.zipcode = params.addressInfo.zonecode;
            that.params.address = params.addressInfo.address;
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
});
</script>

<style scoped>

</style>
