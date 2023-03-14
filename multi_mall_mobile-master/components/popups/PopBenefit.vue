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
                  <select>
                    <option>고객혜택</option>
                  </select>
                </li>
                <li>
                  <div class="title">템플릿 제목 :</div>
                  <div class="body">템플릿 1</div>
                </li>
                <li>
                  <div class="title">혜택내용 :</div>
                  <div class="body">1000p 적립</div>
                </li>
              </ul>
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
});
</script>
