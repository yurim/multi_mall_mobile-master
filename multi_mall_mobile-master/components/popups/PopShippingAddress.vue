<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">배송지 정보</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">배송지명 :</div>
                  <div class="body"><input type="text" placeholder="배송지명을 입력해주세요."></div>
                </li>
                <li>
                  <div class="title">수취인명 :</div>
                  <div class="body"><input type="text" placeholder="이름을 입력해주세요."></div>
                </li>
                <li>
                  <div class="title">수취인 연락처 :</div>
                  <div class="body"><input type="number" placeholder="숫자만 입력해주세요."></div>
                </li>
                <li>
                  <div class="title">배송지 주소 :</div>
                  <div class="body">
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호">
                      <a href="javascript:;">우편번호</a>
                      <input type="text" placeholder="주소">
                      <input type="text" placeholder="상세주소">
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
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  methods: {},
});
</script>
