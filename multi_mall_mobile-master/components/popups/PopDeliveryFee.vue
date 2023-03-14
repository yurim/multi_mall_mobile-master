<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">title</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">템플릿 제목 :</div>
                  <div class="body">템플릿 1</div>
                </li>
                <li>
                  <div class="title">배송비 유형 :</div>
                  <div class="body">유료</div>
                </li>
                <li>
                  <div class="title">배송비 결제 시점 :</div>
                  <div class="body">선불</div>
                </li>
                <li>
                  <div class="title">배송비 부과방법 :</div>
                  <div class="body">개당 배송비 부과</div>
                </li>
                <li>
                  <div class="title">배송비 배송금액 :</div>
                  <div class="body">10,000원</div>
                </li>
                <li>
                  <div class="title">출고지 :</div>
                  <div class="body">주소</div>
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
