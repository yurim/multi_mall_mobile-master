<template>
  <client-only>
    <div class="popup-mask" @click="onClickOutside">
        <div class="popup-wrapper">
          <div class="popup-container">

            <div class="popup_wrap">
              <div class="popup_title text-center">발송지연 안내하기</div>
              <div class="popup_text_wrap">
                <ul class="explain_wrap">
                  <li>- 결제일로부터 3영업일 이내에 발송처리가 불가한 경우, <span class="color_main_01">‘발송지연 안내’</span> 처리를 하셔야 합니다.</li>
                  <li>- 발송지연 안내 처리는 1회만 가능하며, 입력하신 지연사유는 구매자에게 안내가 됩니다.</li>
                  <li>- 발송기한은 결제일로부터 최대 90일까지 설정이 가능합니다.</li>
                </ul>
                <ul class="list_wrap">
                  <li>
                    <div class="title">발송지연 사유 :</div>
                    <div class="body">
                      <select>
                        <option>code.value.name</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div class="title">발송예정날짜 :</div>
                    <div class="body">
                      <div class="date_input_wrap pull-left">
                        v-menu
                      </div>
                    </div>
                  </li>
                </ul>

                <div class="color_main_01"><b>발송지연 상세 사유 reasonLength /500자</b></div>
                <div>
                  <textarea rows="3" placeholder="내용을 입력해주세요."></textarea>
                </div>

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
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data() {
    return {
      menu: false,
      params: {
        reason_sub_type: '',
        expected_dispatched_at: '',
        reason: '',
      },
      codeList: [],
    };
  },
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
    reasonLength() {
      return this.params.reason.length;
    },
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type']);
    this.codeList = this.codesValueArray('reason_sub_type', 'PSTPN_DLVRY');
    this.params.reason_sub_type = this.codeList[0].value.code;
  },
  methods: {
    onClickOutside() {
      this.menu = false;
    },
    allowedDates(val) {
      return val > this.$moment().format(this.dateFormat);
    },
  },
});
</script>
