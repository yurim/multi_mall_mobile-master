<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">title</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap w_100">
                <li>
                  <div class="title">subTitle</div>
                  <div class="body">
                    <textarea rows="3" placeholder="내용을 입력해주세요."></textarea>
                  </div>
                </li>
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">
                    <select>
                      <option>code.value</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">택배사</div>
                  <div class="body">
                    <select>
                      <option>code.value</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">송장번호</div>
                  <div class="body"><input type="number" placeholder="송장번호를 입력해주세요." class="w_100"></div>
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
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    params: {
      delivery_method: '',
      delivery_company: '',
      invoice_num: '',
      reason: '',
    },
    methodList: [],
    companyList: [],
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
  async created() {
    await this.$store.dispatch('common/getCodes', ['delivery_method', 'delivery_company']);
    this.methodList = this.codesArray('delivery_method');
    this.companyList = this.codesArray('delivery_company');
    this.params.delivery_method = this.methodList[0].key;
    this.params.delivery_company = this.companyList[0].key;
  },
  methods: {},
});
</script>
