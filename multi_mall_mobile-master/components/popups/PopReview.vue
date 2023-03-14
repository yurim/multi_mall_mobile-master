<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <form>
            <div class="product_popup_wrap">
            <div class="popup_wrap width_m">
              <div class="popup_title">
                리뷰 글번호 :  review.id
                <div class="day">review.created_at | date</div>
              </div>

              <div class="popup_text_wrap">
                <div class="review_wrap">
                  <div>DefaultImage :imageUrl="review.review_image"</div>
                  <div>
                    <ul class="list_wrap">
                      <li>
                        <div>상품명 :</div>
                        <div><a> review.product_name</a></div>
                      </li>
                      <li>
                        <div>옵션 :</div>
                        <div>review.option_values</div>
                      </li>
                      <li>
                        <div>상품주문번호 :</div>
                        <div>review.order_num</div>
                      </li>
                      <li>
                        <div>작성자 :</div>
                        <div> review.user</div>
                      </li>
                      <li>
                        <div>매장명 :</div>
                        <div><a> review.store_name</a></div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="sub_title">
                  <div>
                    <div class="sub_txt color_main_01"><b>리뷰내용:</b></div>
                    <div class="border_b7 p_10 font_12">
                       review.content
                    </div>
                  </div>
                </div>
                <div>
                  <div class="popup_text_wrap">
                    <div class="color_main_01"><b>답변내용 :</b></div>
                    <textarea id="" cols="30" rows="10"></textarea>
                  </div>
                </div>

                <ul class="list_wrap">
                  <li>
                    <div class="title">베스트 리뷰 선정</div>
                    <div class="body">
                      <select>
                        <option>Y</option>
                        <option>N</option>
                      </select>
                    </div>
                  </li>
                </ul>
                <ul class="list_wrap two">
                  <li>
                    <div class="title">베스트 리뷰 여부</div>
                    <div class="body">review.is_best === false ? 'N' : 'Y'</div>
                  </li>
                </ul>
              </div>
            </div>
            </div>
          </form>

        </div>

        <div class="popup_btn_wrap">
          <button @click.prevent="cancel" class="line_btn">취소</button>
          <button @click.prevent="ok">저장</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import Utils from '@/plugins/utils';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    review: {
      type: Object,
      default: null,
    },
    $router: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    params: { review_id: '', reply: '', is_best: true },
    userGrade: '',
  }),
  created() {
    this.params.review_id = this.review.id;
    this.params.is_best = this.review.is_best;
    if (this.review.reply_id) {
      this.params.reply_id = this.review.reply_id;
      this.params.reply = this.review.reply_content;
    }
  },
  beforeMount() {
    const jwt = Utils.getCookie(document.cookie, 'jwt');
    if (jwt) {
      const info = JSON.parse(atob(jwt.split('.')[1]));
      this.userGrade = info.info.split('_')[1];
    }
  },
  methods: {
    pageToStoreRedirect() {
      if (this.userGrade === '1') this.$router.push({ name: 'store_admin-store-id', params: { id: this.review.store_id } });
      if (this.userGrade === '2') this.$router.push({ name: 'super_admin-store-id', params: { id: this.review.store_id } });
      this.$destroy();
    },
    pageToProductRedirect() {
      if (this.userGrade === '1') this.$router.push({ name: 'store_admin-product-id', params: { id: this.review.product_id } });
      if (this.userGrade === '2') this.$router.push({ name: 'super_admin-product-id', params: { id: this.review.product_id } });
      this.$destroy();
    },
  },
});
</script>
