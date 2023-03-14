<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container popup_slide">
          <div class="popup_slide_list_wrap">
            <div class="popup_slide_wrap">
              <swiper v-if="review.review_images && review.review_images.length > 0"  :options="mainSlide">
                <swiper-slide v-for="(image, index) in review.review_images" class="slide_vis" :key="index"><img alt="기본 이미지" :src="image"></swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>
              <img v-else alt="기본 이미지" src="@/assets/img/product_default_img.png">
            </div>
            <div class="info_wrap" v-if="review">
              <div class="rate_wrap">
                <Star :readonly="true"
                      :disabled="true"
                      :rateNumber="`pop-${review.id}`"
                      :star="review.score"></Star>
                <span class="point"><span>{{ review.score }}</span>점</span>
                <span v-if="review.is_best" class="main_red">BEST</span>
              </div>
              <div class="date_wrap">
                {{ review.name }} ㅣ {{ review.created_at | date }}<br/>
                옵션 : {{ review.option_values }}
                <template v-if="!review.isAbroad"> | {{ review.amount | comma }}개</template>
              </div>
              <div class="text_wrap">
                <!-- 해외상품 리뷰 (원문, 번역) -->
                <template v-if="review.isAbroad">
                  <div class="user_txt">
                    <div class="review_text">
                    <span class="text_title">
                      {{ isAbroadTranslation ? '번역 리뷰' : '원본 리뷰' }}
                    </span>
                      <span class="checkbox_wrap pull-right">
                      <input v-model="isAbroadTranslation" type="checkbox" id="test01" name="test01" checked>
                      <label for="test01">한글로 번역하기</label>
                    </span>
                    </div>
                    <div class="review_content">
                      <p class="txt_story">{{ isAbroadTranslation ? review.translation_content : review.content }}</p>
                    </div>
                  </div>
                </template>
                <!-- 국내상품 리뷰 -->
                <template v-else>
                  <div class="user_txt">
                    <div class="review_text">
                      <div class="text_title m_b_5">
                        <em>리뷰내용</em>
                      </div>
                      <p class="txt_story">{{ review.content }}</p>
                    </div>
                  </div>
                  <div class="admin_txt" v-if="review.reply_content">
                    <div class="review_text">
                      <div class="text_title m_b_5">
                        <span class="abbreviation_icon"></span><em>판매자답변</em>
                      </div>
                      <p class="txt_story">{{ review.reply_content }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- 리뷰 없을시-->
            <div class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다</div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <a @click="cancel">닫기</a>
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
    review: {
      type: Object,
    },
  },
  data: () => ({
    mainSlide: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    },
    isAbroadTranslation: true,
  }),
  created() {
  },
  methods: {
  },
});
</script>
