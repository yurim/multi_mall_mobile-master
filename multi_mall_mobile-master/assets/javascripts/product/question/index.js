import { mapGetters } from 'vuex';
import UserAuthMixin from '@/components/UserAuthMixin';

const prefix = 'product/question';

export default {
  mixins: [UserAuthMixin],
  data() {
    return {
      // Pagination
      questionCurrPage: 1,
      maxContentLength: 500,
    };
  },
  computed: {
    ...mapGetters({
      questions: `${prefix}/questions`,
      questionTotalCount: `${prefix}/totalCount`,
      questionPageSize: `${prefix}/pageSize`,
    }),
  },
  created() {
    const query = { ...this.$route.query };
    this.questionCurrPage = query.question_page ? parseInt(query.question_page, 10) : 1;
  },
  methods: {
    async refresh() {
      const query = { ...this.$route.query };
      await this.getQuestions(query);
    },
    async getQuestions(query) {
      this.loading = true;
      const params = this.$route.params;
      const data = { id: params.id, query };
      await this.$store.dispatch(`${prefix}/getQuestions`, data);
      this.loading = false;
    },
    async onQuestionsPage(query) {
      await this.getQuestions(query);
    },

    /**
     * 문의등록 팝업
     */
    clickQuestionBtn() {
      new this.$popup.InquiryWrite({
        propsData: {
          okCallback: async (params) => {
            if (params.content) params.content = params.content.trim();
            if (!params.content) return this.$popup.showAlertPopup('문의 내용을 입력해주세요.');

            const data = {
              product_id: this.$route.params.id,
              params,
            };
            const res = await this.$store.dispatch(`${prefix}/createQuestion`, data);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },

    /**
     * 문의 삭제하기
     * @param id productquestion id
     */
    deleteQuestion(id) {
      new this.$popup.Confirm({
        propsData: {
          title: '문의를 삭제하시겠습니까?',
          okCallback: async (params) => {
            const data = {
              product_id: this.$route.params.id,
              params: { question_id: id },
            };
            const res = await this.$store.dispatch(`${prefix}/deleteQuestion`, data);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },

    /**
     * 문의 수정 edit 활성화
     * @param groupIndex 질문 그룹 index
     * @param questionIndex 질문 그룹에 포함 된 question index
     */
    modifyQuestion(groupIndex, questionIndex) {
      const questions = this.questions[groupIndex];
      questions[questionIndex].show_edit = true;
      questions[questionIndex].modify_content = questions[questionIndex].content;
      this.questions.splice(groupIndex, 1, questions);
    },

    /**
     * 문의 수정 취소
     * @param groupIndex 질문 그룹 index
     * @param questionIndex 질문 그룹에 포함 된 question index
     */
    cancelModifyQuestion(groupIndex, questionIndex) {
      const questions = this.questions[groupIndex];
      questions[questionIndex].show_edit = false;
      this.questions.splice(groupIndex, 1, questions);
    },

    /**
     * 문의 수정 저장
     * @param groupIndex 질문 그룹 index
     * @param questionIndex 질문 그룹에 포함 된 question index
     */
    async saveModifyQuestion(groupIndex, questionIndex) {
      const question = this.questions[groupIndex][questionIndex];
      if (question.modify_content === '') return this.$popup.showAlertPopup('문의를 입력해주세요.');
      if (question.modify_content.length > this.maxContentLength) return this.$popup.showAlertPopup(`최대 ${this.maxContentLength}자까지 입력할 수 있습니다.`);

      const data = {
        product_id: this.$route.params.id,
        params: { question_id: question.id, content: question.modify_content },
      };
      const res = await this.$store.dispatch(`${prefix}/updateQuestion`, data);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      this.$popup.showAlertPopup('완료되었습니다.');
      await this.refresh();
    },

    /**
     * 추가문의 등록하기
     * @param parentId productquestion id
     * @param totalCount 하나의 그룹에 포함 되어있는 문의 수
     */
    async addQuestion(parentId, totalCount) {
      const content = document.getElementById(`add-question-${parentId}`).value;
      if (content === '') return this.$popup.showAlertPopup('문의를 입력해주세요.');
      if (content.length > this.maxContentLength) return this.$popup.showAlertPopup(`최대 ${this.maxContentLength}자까지 입력할 수 있습니다.`);
      if (totalCount >= 10) return this.$popup.showAlertPopup('추가 문의 개수를 초과하였습니다. 새로운 문의를 등록해 주시기 바랍니다.');

      const data = {
        product_id: this.$route.params.id,
        params: { parent_id: parentId, content },
      };
      const res = await this.$store.dispatch(`${prefix}/addQuestion`, data);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      this.$popup.showAlertPopup('완료되었습니다.');
      await this.refresh();
    },
  },
};
