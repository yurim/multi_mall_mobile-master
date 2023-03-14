<template>
<!--  문의하기 팝업창-->
  <div class="popup-mask">
    <div class="popup-wrapper">
      <div class="popup-container">
        <div class="info_popup_wrap">
          <div class="main_title">문의하기</div>
          <div class="info_group">
<!--            isMallInquiry == true 인 경우 css 확인 필요  -->
            <ul v-if="isMallInquiry">
              <li>
                  <div class="title">문의 유형</div>
                  <div class="body">
                    <select>
                      <option value="">선택</option>
                      <option v-for="(type, i) in faqTypeList" :key="`faqType_${i}`" :value="type.key">{{ type.value }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">작성자</div>
                  <div class="body">
                    <input type="text" name="email" placeholder="이메일을 입력해주세요." v-model="params.author">
                  </div>
                </li>
                <li>
                  <div class="title">제목</div>
                  <div class="body">
                    <input type="text" placeholder="제목 입력" class="w_100" v-model="params.title">
                  </div>
                </li>
            </ul>

            <ul class="" v-else>
              <li v-if="Object.keys(data).length > 0">
                <div class="brand_color m_b_10 font_12">구매하시려는 상품에 대해 궁금하신 점이 있으신 경우 문의해주세요.</div>
                <div class="status_name">상품명</div>
                <div class="status_info">
                  <div class="date_wrap">
<!--                    <div class="info_title">{{ data.store_name_kor }}</div>-->
                    <div class="info_title">{{ data.name }}</div>
                    <div class="info_txt font_12">{{ data.option ? `[${data.option}]` : '' }}</div>
                    <div class="info_txt font_12">{{ data.amount ? data.amount : 0 | comma }}개</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="status_name">
                  <span>내용 <span class="brand_color font_12">({{ contentLength }}/{{ maxContentLength }}자)</span></span>
                </div>
                <div class="status_info">
                  <textarea placeholder="내용을 입력해주세요." v-model="params.content"></textarea>
                  <div class="checkbox_wrap">
                    <input type="checkbox" id="agreementAll" v-model="params.is_secret">
                    <label for="agreementAll">비밀글로 문의하기</label>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="popup_btn_wrap">
        <a @click="cancel" class="line_btn">취소</a>
        <a @click="ok">작성</a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    data: {
      type: Object,
      default: {},
    },
    isMallInquiry: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    maxContentLength: 500,
    faqTypeList: [],
    params: {
      faq_type: '',
      author: '',
      title: '',
      is_secret: false,
      content: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
    contentLength() {
      return this.params.content.length;
    },
  },
  async created() {
    if (this.isMallInquiry) {
      await this.$store.dispatch('common/getCodes', 'faq_type');
      this.faqTypeList = this.codesArray('faq_type');
    }
  },
  methods: {
    checkData() {
      if (this.params.content) this.params.content = this.params.content.trim();
      if (!this.params.content) return this.$popup.showAlertPopup('문의 내용을 입력해주세요.');
      if (this.params.content.length > this.maxContentLength) return this.$popup.showAlertPopup('입력 가능한 글자수를 초과하였습니다.');
      return true;
    },
    ok() {
      if (this.okCallback) {
        const check = this.checkData();
        if (check) {
          this.okCallback(this.params);
        }
      }
    },
    pageToRedirect() {
      this.$router.push({ name: 'mypage-inquiry' });
    },
  },
});
</script>
