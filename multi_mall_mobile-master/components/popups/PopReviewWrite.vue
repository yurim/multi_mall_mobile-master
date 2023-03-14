<template>
  <div class="popup-mask">
    <div class="popup-wrapper">
      <div class="popup-container">
        <div class="review_write_popup_wrap">
          <div class="main_title">리뷰쓰기</div>
          <div class="content_info">
            <ul>
              <li>
                <div class="review_img">
                  <DefaultImage :imageUrl="data.product_image"/>
                </div>
                <div class="review_info">
                  <div class="date_wrap">
                    <div class="brand_title">{{ data.store_name_kor }}</div>
                    <div class="info_title">{{ data.product_name }}</div>
                    <div class="info_txt">{{ data.ordered_at | date }} 옵션 : [{{ data.product_option_names }}] {{ data.amount | comma }}개 ㅣ {{ data.product_price | comma }}원</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="rate_wrap">
                  <div class="star_rate_wrap">
                    <div class="info_title">상품 별점선택</div>
                    <div class="rate">
                      <Star class="w_100 m_l_0" :size_l="true" @setStar="getStar" />
                    </div>
                    <div class="info_txt select_review" :class="{ on: this.selectMessageOn }">상품에 만족하셨나요? 별점을 선택해주세요.</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="info_title">리뷰내용 작성</div>
                <textarea rows="6" placeholder="상품을 사용해 보셨다면 후기를 작성해주세요. " v-model="params.content"></textarea>
              </li>
              <li>
                <div class="info_title">이미지 등록</div>
                <div class="review_img_wrap">
                  <ul>
                    <!-- 리뷰 이미지는 최대 5장 리뷰5장이 되면 .add_thumbnail_wrap 삭제 -->
                    <template v-for="(data, i) in reviewImages">
                      <li v-if="data.dataUri" :key="`reviewImage_${i}`">
                        <span class="thumbnail_wrap">
                          <a class="del_icon" v-on:click="deleteImage(i)"></a>
                          <a class="edit_icon" v-on:click="updateImage(i)">수정</a>
                          <img alt="" v-if="data.dataUri" :src="data.dataUri">
                        </span>
                      </li>
                    </template>
                    <li v-if="reviewImages.length < 5">
                      <span class="add_thumbnail_wrap">
                        <input type="file" id="review_images" v-on:change="imageUpload" accept="image/*">
                        <label for="review_images" class="add_icon"><i class="plus_icon"></i>이미지 추가</label>
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div class="register_terms">
            <p>1. 포인트는 최초 작성한 리뷰를 기준으로 지급됩니다.</p>
            <p>2. 사진 첨부시 <em>캡쳐, 도용, 유사상품 촬영, 동일상품 여부 식별이 불가한 경우</em> 에는 등록이 거절되며 사유는 별도 안내되지 않습니다.</p>
            <p>3. 상품과 무관한 내용이나 사진, 동일 문자 반복 등의 부적합한 리뷰는 사전 경고 없이 삭제 및 포인트 회수될 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div class="popup_btn_wrap">
        <button @click="cancel" class="line_btn">취소</button>
        <button @click="ok">등록</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';
import Alert from './PopAlert';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    reviewImages: [],
    params: {
      rate: 0,
      reviewImages: [],
    },
    selectMessageOn: true,
  }),
  methods: {
    getStar(value) {
      this.params.rate = value;
      this.selectMessageOn = false;
    },
    imageUpload(e) {
      const that = this;
      const imageFile = e.target.files[0];
      const recommendSize = (10 * 1024 * 1024);

      if (imageFile) {
        if (recommendSize > imageFile.size) {
          const data = { image: imageFile, dataUri: window.URL.createObjectURL(imageFile) };
          that.reviewImages.forEach((item, i) => {
            if (!item.dataUri) data.idx = i;
          });
          if (Object.prototype.hasOwnProperty.call(data, 'idx')) that.reviewImages.splice(data.idx, 1, data);
          else that.reviewImages.push(data);
        } else {
          that.popupAlert('이미지 용량이 10MB를 초과합니다.\n이미지를 다시 등록해주세요.');
        }
      }
      e.target.value = '';
    },
    deleteImage(idx) {
      this.reviewImages.splice(idx, 1);
    },
    updateImage(idx) {
      this.reviewImages[idx] = { image: {}, dataUri: '' };
      document.getElementById('review_images').click();
    },
    popupAlert(message) {
      new Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    ok() {
      if (this.okCallback) {
        const isEmptyList = [];
        if (!this.params.rate) isEmptyList.push('별점');
        if (!this.params.content) isEmptyList.push('리뷰 내용');
        if (isEmptyList.length === 0) {
          this.reviewImages.forEach((item) => {
            this.params.reviewImages.push(item.image);
          });
          this.okCallback(this.params);
        } else {
          this.popupAlert(`다음을 작성해주세요.\n${isEmptyList.join('\n')}`);
        }
      }
    },
  },
});
</script>
