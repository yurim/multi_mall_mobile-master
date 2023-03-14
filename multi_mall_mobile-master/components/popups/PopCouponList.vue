<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">할인쿠폰</div>

            <div class="popup_text_wrap">

              <table>
                <thead>
                <tr>
                  <th colspan="2">적용가능 할인 쿠폰</th>
                </tr>
                </thead>
                <tbody>
<!--                tr하나당 쿠폰 하나-->
                <tr>
                  <td colspan="2">
                    <div class="radio_wrap text-left p_l_10">
                      <input type="radio" id="test" name="coupon">
                      <label for="test">적용안함</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="radio_wrap text-left p_l_10">
                      <input type="radio" id="test2" name="coupon">
                      <label for="test2">3,000원 할인쿠폰</label>
                    </div>
                  </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <th>할인 금액</th>
                  <td><span class="color_main_01">3000원</span></td>
                </tr>
                </tfoot>
              </table>
            </div>

          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">적용</button>
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
