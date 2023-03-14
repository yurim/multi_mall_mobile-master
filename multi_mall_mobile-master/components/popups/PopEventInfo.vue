<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container bg_green">
          <div class="popup_wrap">
            <div class="pop_img_wrap">
              <img alt="설연휴 배송지연 안내 이미지" src="@/assets/img/popup/new_year.png">
            </div>
          </div>
        </div>
        <div class="popup_btn_wrap bg_green p_b_10">
          <div class="checkbox_wrap text-left d_ib_100 m_t_10 m_b_20">
            <input type="checkbox" name="pop_no_more" id="pop_no_more" v-model="noMoreToday">
            <label for="pop_no_more" class="color_white">오늘 하루 다시 보지않기</label>
          </div>
          <button class="w_100 gray_line_but" @click="close">닫기</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import moment from 'moment-timezone';
import PopupMixin from './popupMixin';

moment.tz.setDefault('Asia/Seoul');

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    noMoreToday: false,
  },
  methods: {
    async close() {
      if (this.noMoreToday) {
        const date = moment().format('YYYY-MM-DD');
        localStorage.setItem('eventNoMoreToday', date);
      }
      this.$destroy();
    },
  },
});
</script>
