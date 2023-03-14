<template>
  <div class="mini_review_wrap">
    <!--  리뷰 평점 START -->
    <div class="info_content">
      <div class="review_show_wrap">
        <div class="renewal_view_box_bottom">
          <div class="product_title"><span>리뷰 평점</span></div>
          <div class="list_tab_top">
            <ul>
              <li :class="{ 'on': activeReviewScoreTab === 'lowest' }">
                <a @click="activeReviewScoreTab = 'lowest'">리뷰 평점(<em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>)</a>
              </li>
              <li :class="{ 'on': activeReviewScoreTab === 'other' }">
                <a @click="activeReviewScoreTab = 'other'">다른 매장 리뷰 평점</a>
              </li>
            </ul>
          </div>

          <!-- *** 리뷰 평점 START *** -->
          <div class="review_view_box_bottom" :class="{ 'on': activeReviewScoreTab === 'lowest' }">
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
          </div>
          <!-- *** 뷰 평점 END *** -->

          <!-- *** 다른 매장 리뷰 평점 START *** -->
          <div class="review_view_box_bottom" :class="{ 'on': activeReviewScoreTab === 'other' }">
            <div class="review_card_wrap">
              <ul>
                <swiper :options="textReviewSlide" v-if="otherProductScores.length > 0">
                  <swiper-slide v-for="score in otherProductScores" :key="score.product_id">
                    <li>
                      <div class="text_box">
                        <div class="store f_bold">매장명</div>
                        <div class="store_name">{{ score.store_name }}</div>
                        <div class="reaction m_t_10">
                          <div class="review_star_total">
                            <div class="data_star">
                              <div class="only_star"></div>
                              <em>{{ score.score }}</em><span> / 5</span>
                            </div>
                          </div>
                        </div>
                        <div class="store_review_btn">
                          <nuxt-link :to="`/product/${score.product_id}`">{{ score.total_review_count | kUnit | comma }}개의 리뷰 평점</nuxt-link>
                        </div>
                      </div>
                    </li>
                  </swiper-slide>
                </swiper>
                <!--리뷰가 존재하지 않을때 -->
                <li class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</li>
              </ul>
              <div class="swiper-button-prev text_review_slide_prev swiper-button-white" slot="button-prev"></div>
              <div class="swiper-button-next text_review_slide_next swiper-button-white" slot="button-next"></div>
            </div>
          </div>
          <!-- *** 다른 매장 리뷰 평점 END *** -->
        </div>
      </div>
    </div>
    <!--  리뷰 평점 END -->

    <!--  베스트 포토리뷰 START -->
    <div class="info_content">
      <div class="review_show_wrap">
        <div class="renewal_view_box_bottom">
          <div class="product_title"><span>베스트 포토리뷰</span></div>
          <div class="list_tab_top">
            <ul>
              <li :class="{ on: activePhotoReviewTab === 'lowest' }">
                <a @click="activePhotoReviewTab = 'lowest'">포토리뷰(<em>{{ product.best_review_count | comma }}</em>)</a>
              </li>
              <li :class="{ on: activePhotoReviewTab === 'other' }">
                <a @click="activePhotoReviewTab = 'other'">다른 매장 포토리뷰</a>
              </li>
            </ul>
          </div>

          <!-- *** 포토리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activePhotoReviewTab === 'lowest' }">
            <div class="review_card_wrap" v-if="0 < bestReviews.length">
              <ul>
                <swiper :options="photoReviewSlide" @reachEnd="getNextLowestPhotoReview">
                  <swiper-slide v-for="review in bestReviews" :key="review.id">
                    <li>
                      <div class="best_review_img" @click="showReviewPopup(review, false)">
                        <DefaultImage :imageUrl="review.review_images[0]" />
                      </div>
                    </li>
                  </swiper-slide>
                </swiper>
              </ul>
              <div class="swiper-button-prev photo_review_slide_next swiper-button-white" slot="button-prev"></div>
              <div class="swiper-button-next photo_review_slide_prev swiper-button-white" slot="button-next"></div>
            </div>
            <!--리뷰가 존재하지 않을때 -->
            <div class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</div>
          </div>
          <!-- *** 포토리뷰 END *** -->

          <!-- *** 다른 매장 포토리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activePhotoReviewTab === 'other' }">
            <div class="review_card_wrap" v-if="0 < otherPhotoReviews.length">
              <ul>
                <swiper :options="photoOtherReviewSlide" v-if="otherPhotoReviews.length > 0" @reachEnd="getNextOtherPhotoReview">
                  <swiper-slide v-for="review in otherPhotoReviews" :key="review.id">
                    <li>
                      <nuxt-link :to="`/product/${review.product_id}`">
                        <div class="best_review_img">
                          <DefaultImage :imageUrl="review.image"/>
                          <div class="store_name">{{ review.store_name }}</div>
                        </div>
                      </nuxt-link>
                    </li>
                  </swiper-slide>
                </swiper>
              </ul>
              <div class="swiper-button-prev photo_other_review_slide_next swiper-button-white" slot="button-prev"></div>
              <div class="swiper-button-next photo_other_review_slide_prev swiper-button-white" slot="button-next"></div>
            </div>
            <!--리뷰가 존재하지 않을때 -->
            <div class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</div>
          </div>
          <!-- *** 다른 매장 포토리뷰 END *** -->
        </div>
      </div>
    </div>
    <!--   베스트 포토리뷰 END -->

    <!--  해외리뷰 START -->
    <div class="info_content">
      <div class="review_show_wrap">
        <div class="renewal_view_box_bottom">
          <div class="product_title"><span>해외리뷰</span></div>
          <div class="list_tab_top">
            <ul>
              <li :class="{ on: activeAbroadReviewTab === 'lowest' }">
                <a @click="activeAbroadReviewTab = 'lowest'">해외리뷰(<em>{{ product.abroad_total_review_count | comma }}</em>)</a>
              </li>
              <li :class="{ on: activeAbroadReviewTab === 'other' }">
                <a @click="activeAbroadReviewTab = 'other'">다른 매장 해외리뷰</a>
              </li>
            </ul>
          </div>

          <!-- *** 해외 리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activeAbroadReviewTab === 'lowest' }">

            <!-- todo: CustomPage 정렬 기능 추가 후 아래 주석 해제 -->
<!--            <ul class="tab_menu_wrap">-->
<!--              <li v-for="tab in reviewSortTabs">-->
<!--                <a :class="{ on: tab.key === activeAbroadReviewSortTab }"-->
<!--                   @click="activeAbroadReviewSortTab = tab.key">{{ tab.text }}</a>-->
<!--              </li>-->
<!--            </ul>-->

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
                        <span>{{ abroadReview.writer_id }}</span>ㅣ <span>{{ abroadReview.created_at | date }}</span>ㅣ <span v-if="abroadReview.option_values">옵션 : [{{ abroadReview.option_values }}]</span>
                      </div>
                      <div class="content_txt" :class="{'on': abroadReview.expand}">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ isAbroadTranslation ? abroadReview.translation_content : abroadReview.content }}
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
          </div>
          <!-- *** 해외 리뷰 END *** -->

          <!-- *** 다른 매장 해외 리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activeAbroadReviewTab === 'other' }">
            <div class="review_show_content">
              <ul class="review_show_wrap__list">
                <template v-if="otherAbroadReviews.length > 0">
                  <li v-if="moreOtherAbroadReview || !moreOtherAbroadReview && i < 2"
                      v-for="(review, i) in otherAbroadReviews" :key="review.id">
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="`other-${review.id}`"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.store_name }}</span>
                      </div>
                      <div class="content_txt" :class="{'on': review.expand}">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.translation_content }}
                        </div>
                        <div class="info_text_btn">
                          <nuxt-link :to="`/product/${review.product_id}`">자세히 보기</nuxt-link>
                        </div>
                      </div>
                    </div>
                    <div class="review_show_wrap__img_wrap" v-if="review.review_type === 'PHOTO'">
                      <DefaultImage :imageUrl="review.image_url" />
                    </div>
                  </li>
                </template>
                <!-- 리뷰 없을시-->
                <template v-else>
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </template>
              </ul>
            </div>
            <div class="review_show_btn" v-if="otherAbroadReviews.length > 2 && !moreOtherAbroadReview" @click="moreOtherAbroadReview = true">
              <a>리뷰 더보기</a>
            </div>
          </div>
          <!-- *** 다른 매장 해외 리뷰 END *** -->
        </div>
      </div>
    </div>
    <!--  해외리뷰 END -->

    <!--  국내리뷰 START -->
    <div class="info_content">
      <div class="review_show_wrap">
        <div class="renewal_view_box_bottom">
          <div class="product_title"><span>국내리뷰</span></div>
          <div class="list_tab_top">
            <ul>
              <li :class="{ on: activeReviewTab === 'lowest' }">
                <a @click="activeReviewTab = 'lowest'">국내리뷰(<em>{{ product.total_review_count | kUnit | comma }}</em>)</a>
              </li>
              <li :class="{ on: activeReviewTab === 'other' }">
                <a @click="activeReviewTab = 'other'">다른 매장 국내리뷰</a>
              </li>
            </ul>
          </div>

          <!-- *** 국내 리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activeReviewTab === 'lowest' }">

            <!-- todo: CustomPage 정렬 기능 추가 후 아래 주석 해제 -->
<!--            <ul class="tab_menu_wrap">-->
<!--              <li v-for="tab in reviewSortTabs">-->
<!--                <a :class="{ on: tab.key === activeReviewSortTab }"-->
<!--                   @click="activeReviewSortTab = tab.key">{{ tab.text }}</a>-->
<!--              </li>-->
<!--            </ul>-->

            <div class="gray_tab_menu_wrap">
              <ul class="gray_tab_menu">
                <li v-for="tab in reviewTypeTabs">
                  <a :class="{ on: tab.key === activeReviewTypeTab }"
                     @click="activeReviewTypeTab = tab.key">{{ tab.text }}</a>
                </li>
              </ul>
            </div>

            <div class="review_show_content">
              <ul class="review_show_wrap__list">
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
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.name }}</span>ㅣ <span>{{ review.created_at | date }}</span>ㅣ <span v-if="review.option_values">옵션 : [{{ review.option_values }}] I {{ review.amount | comma }}개</span>
                      </div>
                      <div class="content_txt" :class="{'on': review.expand}">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.content }}
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
          </div>
          <!-- *** 국내 리뷰 END *** -->

          <!-- *** 다른 매장 국내 리뷰 START *** -->
          <div class="review_view_box_bottom" :class="{ on: activeReviewTab === 'other' }">
            <div class="review_show_content">
              <ul class="review_show_wrap__list">
                <template v-if="otherReviews.length > 0">
                  <li v-if="moreOtherReview || !moreOtherReview && i < 2"
                      v-for="(review, i) in otherReviews" :key="review.id">
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="`other-${review.id}`"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.store_name }}</span>
                      </div>
                      <div class="content_txt">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.content }}
                        </div>
                        <div class="info_text_btn">
                          <nuxt-link :to="`/product/${review.product_id}`">자세히 보기</nuxt-link>
                        </div>
                      </div>
                    </div>
                    <div class="review_show_wrap__img_wrap" v-if="review.review_type === 'PHOTO'">
                      <DefaultImage :imageUrl="review.image_url" />
                    </div>
                  </li>
                </template>
                <!-- 리뷰 없을시-->
                <template v-else>
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </template>
              </ul>
            </div>
            <div class="review_show_btn" v-if="otherReviews.length > 2 && !moreOtherReview" @click="moreOtherReview = true">
              <a>리뷰 더보기</a>
            </div>
          </div>
          <!-- *** 다른 매장 국내 리뷰 END *** -->
        </div>
      </div>
    </div>
    <!--  국내리뷰 END -->
  </div>

</template>
<script src="@/assets/javascripts/product/review/other_stores/index.js"></script>
