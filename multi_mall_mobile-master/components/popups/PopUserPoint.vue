<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">현재 포인트 수정</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">포인트 수정 구분</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="point" id="save" :value="'save'" v-model="params.type" v-on:change="resetParams">
                      <label for="save">적립</label>
                      <input type="radio" name="point" id="use" :value="'use'" v-model="params.type" v-on:change="resetParams">
                      <label for="use">차감</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">포인트 수정사유</div>
                  <div class="body">
                    <select>
                      <option>선택</option>
                      <option>item.text</option>
                    </select>
                    <select>
                      <option>선택</option>
                      <option>item.text</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">포인트 금액</div>
                  <div class="body">
                    <input type="number" placeholder="포인트를 입력하세요."class="w_100"/>
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
  data: () => ({
    savingReason: [
      { text: '사진 리뷰 작성', value: 'PHT_REVW' },
      { text: '텍스트 리뷰 작성', value: 'TXT_REVW' },
      { text: '회원가입 적립금', value: 'SIGN_UP' },
      { text: '포인트 사용 취소', value: 'CANCEL' },
      { text: '구매', value: 'BUY' },
    ],
    recoveryReason: [
      { text: '적립금 회수', value: 'RECOVERY' },
      { text: '구매', value: 'BUY' },
    ],
    params: {
      type: 'save',
      reason: '',
      point: 0,
    },
  }),
  methods: {
    resetParams() {
      this.params.reason = '';
    },
    ok() {
      if (this.okCallback) this.okCallback(this.params);
    },
  },
});
</script>
