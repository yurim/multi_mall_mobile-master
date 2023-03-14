<template>
  <!-- 상품리뷰 내용-->
  <div>
    <div class="main_gray">
      상품을 구매하신 분들이 작성하신 리뷰 입니다. 리뷰 작성 시 아래 금액 만큼 포인트가 적립 됩니다.
      <br>
      텍스트리뷰 : {{ textReviewPoint | comma }}원 | 포토 리뷰 : {{ photoReviewPoint | comma }}원
    </div>
    <div class="review_show_wrap">
      <!--  리뷰 평점 START -->
      <div class="product_title"><span>리뷰 평점</span></div>
      <div class="review_star_total">
        <div class="data_star" v-if="product.total_score > 0 && (product.total_review_count + product.abroad_total_review_count) > 0">
          <div class="only_star"></div>
          <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count)) | ceil(1) }}</em>
        </div>
        <div class="data_star" v-else>
          <div class="only_star disabled"></div>
          <em>0</em>
        </div>
        <div class="review_total">{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}개의 리뷰 평점</div>
      </div>
      <div class="review_summary_area">
        <div class="review_area">
          <div class="data_star">
            <div class="star five"></div>
          </div>
          <div class="num_bar">
            <div class="bar_wrap">
              <v-progress-linear :value="(product.score_stats.score_5 / (product.total_review_count + product.abroad_total_review_count) * 100)" class="vue_progress"></v-progress-linear>
            </div>
            <span class="review_total">{{ product.score_stats.score_5 | comma }}</span>
          </div>
        </div>
        <div class="review_area">
          <div class="data_star">
            <div class="star four"></div>
          </div>
          <div class="num_bar">
            <div class="bar_wrap">
              <v-progress-linear :value="(product.score_stats.score_4 / (product.total_review_count + product.abroad_total_review_count) * 100)" class="vue_progress"></v-progress-linear>
            </div>
            <span class="review_total">{{ product.score_stats.score_4 | comma }}</span>
          </div>
        </div>
        <div class="review_area">
          <div class="data_star">
            <div class="star three"></div>
          </div>
          <div class="num_bar">
            <div class="bar_wrap">
              <v-progress-linear :value="(product.score_stats.score_3 / (product.total_review_count + product.abroad_total_review_count) * 100)" class="vue_progress"></v-progress-linear>
            </div>
            <span class="review_total">{{ product.score_stats.score_3 | comma }}</span>
          </div>
        </div>
        <div class="review_area">
          <div class="data_star">
            <div class="star two"></div>
          </div>
          <div class="num_bar">
            <div class="bar_wrap">
              <v-progress-linear :value="(product.score_stats.score_2 / (product.total_review_count + product.abroad_total_review_count) * 100)" class="vue_progress"></v-progress-linear>
            </div>
            <span class="review_total">{{ product.score_stats.score_2 | comma }}</span>
          </div>
        </div>
        <div class="review_area">
          <div class="data_star">
            <div class="star one"></div>
          </div>
          <div class="num_bar">
            <div class="bar_wrap">
              <v-progress-linear :value="(product.score_stats.score_1 / (product.total_review_count + product.abroad_total_review_count) * 100)" class="vue_progress"></v-progress-linear>
            </div>
            <span class="review_total">{{ product.score_stats.score_1 | comma }}</span>
          </div>
        </div>
      </div>
      <!-- 리뷰 평점 END -->

      <!-- 베스트 포토 리뷰 START -->
      <div class="product_title">
        <span>베스트 포토리뷰 <span class="color_main_01">{{ product.best_review_count | comma }}</span>건</span>
<!--        <ul class="tab_menu_wrap">-->
<!--          <li><a href="javascript:;" class="on">더보기</a></li>-->
<!--        </ul>-->
      </div>
      <div>
        <swiper class="swiper gallery-top" :options="swiperOption" ref="swiperTop" @reachEnd="getNextBestReview">
          <swiper-slide v-for="review in bestReviews" :key="review.id">
            <div @click="showReviewPopup(review, false)">
              <DefaultImage :imageUrl="review.review_images[0]" />
            </div>
          </swiper-slide>
          <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
          <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
        </swiper>
      </div>
      <!-- 베스트 포토 리뷰 END -->

      <!-- 해외 구매리뷰 START -->
      <div class="product_title">
        <span>해외 구매리뷰 <span class="color_main_01">{{ product.abroad_total_review_count | comma }}</span>건</span>

        <!-- todo: CustomPage 정렬 기능 추가 후 아래 주석 해제 -->
<!--        <ul class="tab_menu_wrap">-->
<!--          <li v-for="tab in reviewSortTabs">-->
<!--            <a :class="{ on: tab.key === activeAbroadReviewSortTab }"-->
<!--               @click="activeAbroadReviewSortTab = tab.key">{{ tab.text }}</a>-->
<!--          </li>-->
<!--        </ul>-->

      </div>
      <div class="gray_tab_menu_wrap">
        <ul class="gray_tab_menu">
          <li v-for="tab in abroadReviewTypeTabs">
            <a :class="{ on: tab.key === activeAbroadReviewTypeTab }"
               @click="activeAbroadReviewTypeTab = tab.key">{{ tab.text }}</a>
          </li>
        </ul>
        <div class="checkbox_wrap pull-right">
          <input v-model="isAbroadTranslation" type="checkbox" id="test_1" name="test_1" checked>
          <label for="test_1">한글로 번역하기</label>
        </div>
      </div>
      <div class="review_show_content">
        <ul class="review_show_wrap__list">
          <template v-if="abroadReviews.length > 0">
            <li v-if="moreAbroadReview || !moreAbroadReview && i < 2"
                v-for="(abroadReview, i) in abroadReviews" :key="abroadReview.id">
              <div class="review_show_wrap__info_wrap">
                <div>
                  <Star :readonly="true"
                        :disabled="true"
                        :rateNumber="abroadReview.id"
                        :star="abroadReview.score"></Star>
                  <span class="m_l_10">{{ abroadReview.score }}점</span>
                </div>
                <div class="review_show_wrap__info_wrap_option">
                  <span>{{ abroadReview.writer_id }}</span>ㅣ <span>{{ abroadReview.created_at | date }}</span>ㅣ <span>옵션 : [{{ abroadReview.option_values }}]</span>
                </div>
                <div class="content_txt" :class="{'on': abroadReview.expand}">
                  <div class="review_show_wrap__info_wrap_text">
                    <p class="txt_story">{{ isAbroadTranslation ? abroadReview.translation_content : abroadReview.content }}</p>
                  </div>
                  <div class="info_text_btn">
                    <a v-if="!abroadReview.expand" @click="expandAbroadReview(i, true)">펼치기</a>
                    <a v-else @click="expandAbroadReview(i, false)">접기</a>
                  </div>
                </div>
              </div>
              <div class="review_show_wrap__img_wrap" v-if="abroadReview.review_type === 'PHOTO'"
                   @click="showReviewPopup(abroadReview, true)">
                <DefaultImage :imageUrl="abroadReview.image_url" />
              </div>
            </li>
          </template>

          <!-- 리뷰 없을시-->
          <template v-else>
            <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
          </template>

        </ul>
        <div v-if="abroadReviews.length > 0 && moreAbroadReview" class="pagenation_wrap">
          <Pagenation :total-count="abroadReviewTotalCount" :page-size="abroadReviewPageSize" :default-page="abroadReviewCurrPage"
                      :page-key-name="'abroad_review_page'" :page-size-key-name="'abroad_review_page_size'"
                      :onPage="onAbroadReviewsPage"></Pagenation>
        </div>
      </div>
      <div class="review_show_btn" v-if="abroadReviews.length > 2 && !moreAbroadReview" @click="moreAbroadReview = true">
        <a>리뷰 더보기</a>
      </div>
      <!-- 해외 구매리뷰 END -->

      <!-- 국내 구매리뷰 START -->
      <div class="product_title">
        <span>국내 구매리뷰 <span class="color_main_01">{{ product.total_review_count | comma }}</span>건</span>

        <ul class="tab_menu_wrap">
          <li v-for="tab in reviewSortTabs">
            <a href="javascript:;" :class="{ on: tab.key === activeReviewSortTab }"
               @click="activeReviewSortTab = tab.key">{{ tab.text }}</a>
          </li>
        </ul>

      </div>
      <div class="gray_tab_menu_wrap">
        <ul class="gray_tab_menu">
          <li v-for="tab in reviewTypeTabs">
            <a href="javascript:;" :class="{ on: tab.key === activeReviewTypeTab }"
               @click="activeReviewTypeTab = tab.key">{{ tab.text }}</a>
          </li>
        </ul>
      </div>
      <div class="review_show_content">
        <ul class="review_show_wrap__list">
          <!-- Review Content START -->
          <template v-if="reviews.length > 0">
            <li v-if="moreReview || !moreReview && i < 2" v-for="(review, i) in reviews" :key="review.id">
              <div class="review_show_wrap__info_wrap">
                <div>
                  <Star :readonly="true"
                        :disabled="true"
                        :rateNumber="review.id"
                        :star="review.score"></Star>
                  <span class="m_l_10">{{ review.score }}점</span>
                  <!-- BEST 선정시-->
                  <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                </div>
                <div class="review_show_wrap__info_wrap_option"><span>{{ review.name }}</span> ㅣ
                  <span>{{ review.created_at | date }}</span> ㅣ <span v-if="review.option_values">옵션 : [{{ review.option_values }}] | </span> <span> {{ review.amount | comma }}개 </span>
                </div>
                <div class="content_txt" :class="{'on': review.expand}">
                  <div class="review_show_wrap__info_wrap_text">
                    <p class="txt_story">{{ review.content }}</p>
                  </div>
                  <div class="info_text_btn">
                    <a v-if="!review.expand" @click="expandReview(i, true)">펼치기</a>
                    <a v-else @click="expandReview(i, false)">접기</a>
                  </div>
                </div>
              </div>

              <div class="review_show_wrap__img_wrap" v-if="review.review_type === 'PHOTO'"
                   @click="showReviewPopup(review, false)">
                <DefaultImage :imageUrl="review.review_images[0]" />
              </div>

              <span class="admin_txt_wrap">
                <div class="admin_txt" v-if="review.replyExpand && review.reply_content">
                  <div class="abbreviation_icon"></div>
                  <div class="admin">
                    <p>판매자답변<em>{{ review.reply_created_at | date }}</em></p>
                    <p class="txt_story">{{ review.reply_content }}</p>
                  </div>
                </div>
                <div class="admin_txt_btn" v-if="review.is_replied">
                  <a class="answer_num_txt" v-if="!review.replyExpand" @click="expandReply(i, true)">
                    <span class="abbreviation_icon"></span><em>1</em>개의 답변이 존재합니다.
                  </a>
                  <a v-else @click="expandReply(i, false)">답변닫기</a>
                </div>
              </span>
              <!-- Review Content END -->
            </li>
          </template>

          <!-- 리뷰 없을시-->
          <template v-else>
            <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
          </template>

        </ul>
        <div v-if="reviews.length > 0 && moreReview" class="pagenation_wrap">
          <Pagenation :total-count="reviewTotalCount" :page-size="reviewPageSize" :default-page="reviewCurrPage"
                      :page-key-name="'review_page'" :page-size-key-name="'review_page_size'"
                      :onPage="onReviewsPage"></Pagenation>
        </div>
      </div>
      <div class="review_show_btn" v-if="reviews.length > 2 && !moreReview" @click="moreReview = true">
        <a>리뷰 더보기</a>
      </div>
      <!-- 국내 구매리뷰 END -->

    </div>
  </div>
</template>

<script src="@/assets/javascripts/product/review/index.js"></script>
