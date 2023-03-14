<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <form>
            <div class="product_popup_wrap">
            <div class="popup_wrap width_m">
              <div class="popup_title">
                문의 글번호 :  qna.id
                <div class="day">qna.created_at | date </div>
              </div>

              <div class="popup_text_wrap word_break_all">
                <div class="review_wrap">
                  <div>
                   :imageUrl="qna.product_image"
                  </div>
                  <div>
                    <ul class="list_wrap">
                      <li>
                        <div>상품명 :</div>
                        <div> qna.product_name </div>
                      </li>
                      <li>
                        <div>상품코드 :</div>
                        <div> qna.product_id </div>
                      </li>
                      <li>
                        <div>등록자 :</div>
                        <div> qna.creator </div>
                      </li>
                      <li>
                        <div>판매 매장명 :</div>
                        <div><a> qna.store_name </a></div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="sub_title">
                  <div class="sub_txt color_main_01"><b>문의 내용:</b></div>
                  <div class="border_b7 p_10 font_12">
                     qna.content
                  </div>
                </div>

                <div class="popup_text_wrap">
                  <ul class="answer_history">
                    <li>
                      <div class="title">
                         idx === 0 ? '답변' : '추가답변'  내용:
                        <span class="replay_update pull-right">
                          <a>취소</a>
                          <a>확인</a>
                        </span>
                        <span>
                          <a class="reply_update">수정</a>
                        </span>
                      </div>
                      <div>
                          rows="1"
                          v-if="reply.isUpdate"
                          v-model="reply.nextContent"
                          rows="1"
                          class="text_readonly"
                          readonly="readonly"
                          v-model="reply.content"
                          v-else
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="popup_text_wrap">
                  <div class="color_main_01"><b>답변작성 :</b></div>
                  <textarea name="" id="" cols="30" rows="10"></textarea>
                </div>

              </div>
            </div>
            </div>
          </form>

        </div>

        <div class="popup_btn_wrap">
          <button class="line_btn">취소</button>
          <button>확인</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';
import Alert from './PopAlert';

let prefix = 'super_admin/product/qna';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    qna: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    replies: [],
    params: { question_id: '', content: '' },
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      const path = window.location.pathname;
      if (path.indexOf('store_admin') > -1) prefix = 'store_admin/product/qna';
      that.params.question_id = that.qna.id;
      if (that.qna.replyList !== null) {
        if (that.qna.replyList.length > 0) {
          that.qna.replyList.forEach((reply) => {
            that.replies.push({ answer_id: reply.id, content: reply.content, nextContent: reply.content, isUpdate: false });
          });
        }
      }
    },
    updateReplyCancel(reply, isAvailable) {
      reply.nextContent = reply.content;
      reply.isUpdate = isAvailable;
    },
    async updateReply(reply, isAvailable) {
      const that = this;
      if (isAvailable) {
        reply.isUpdate = isAvailable;
      } else {
        reply.content = reply.nextContent;
        const result = await that.$store.dispatch(`${prefix}/patchReply`, reply);
        if (result.result === 'success') {
          that.popupAlert('답변이 수정되었습니다.');
          reply.isUpdate = isAvailable;
        } else {
          that.popupAlert(result.message);
        }
      }
    },
    popupAlert(message) {
      new Alert({
        propsData: {
          title: message,
          okCallback: (inParams) => inParams.$destroy(),
        },
      }).$mount();
    },
  },
});
</script>
