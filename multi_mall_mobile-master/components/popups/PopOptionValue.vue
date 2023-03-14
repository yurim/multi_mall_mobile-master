<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title">옵션값 변경</div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap color_main_01">
                <li> - 옵션값을 변경할 옵션을 선택하여 옵션값을 변경합니다.</li>
                <li> - 한번에 하나의 옵션명을 선택하여 옵션값을 변경할 수 있습니다.</li>
              </ul>
              <ul class="list_wrap">
                <li>
                  <table>
                    <colgroup>
                      <col width="70">
                      <col width="100">
                      <col width="300">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>선택</th>
                        <th>옵션명</th>
                        <th>옵션값</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="only_checkbox_wrap">
                            <input type="radio" name="selectOption">
                            <label></label>
                          </div>
                        </td>
                        <td>option.name</td>
                        <td>option.values</td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title w_25">values.currentValue</div>
                  <div class="body">
                    <input type="text"placeholder="변경할 옵션값을 입력해주세요." class="w_100">
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="updateOptionValue">옵션값 변경</button>
          <button @click="ok">적용</button>
          <button class="line_btn" @click="cancel">취소</button>
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
    options: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    params: { idx: [], values: [] },
  }),
  methods: {
    checkOption(e) {
      this.params.idx = e.target.value;
    },
    updateOptionValue() {
      if (this.params.idx) {
        const optionValues = this.options[this.params.idx].values.split(',');
        optionValues.forEach((optionValue) => {
          this.params.values.push({ currentValue: optionValue.trim(), nextValue: '' });
        });
      } else {
        this.$popup.showAlertPopup('옵션값을 변경할 옵션을 선택해주세요.');
      }
    },
    ok() {
      if (this.okCallback) this.okCallback(this.params);
    },
  },
});
</script>
