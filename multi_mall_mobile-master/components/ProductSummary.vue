<template>
  <div class="list_box">
    <v-container>
    <nuxt-link :to="`/product/${product.id}`">
      <div class="img_wrap">
        <DefaultImage :imageUrl="product.main_image" />
      </div>
    </nuxt-link>
    <div class="text_wrap">
      <div class="store_wrap">
        <nuxt-link :to="`/store/${product.store_id}`" v-if="product.store_id">{{ product.store_name }}</nuxt-link>
        <span v-else>{{ product.store_name }}</span>
      </div>
      <div class="title_wrap"><nuxt-link :to="`/product/${product.id}`">{{ product.name }}</nuxt-link></div>
      <div class="price_wrap" v-if="product.discount_price">
        <div class="base-price">{{ product.price | comma }}원</div>
        <div class="discount-percentage"><em>{{ (1 - product.discount_price / product.price) * 100 | rate }}</em>%</div>
        <div class="sale-price"><em>{{ product.discount_price | comma }}</em>원</div>
      </div>
      <div class="price_wrap" v-else>
        <div class="sale-price"><em>{{ product.price | comma }}</em>원</div>
      </div>
      <div class="reaction">
        <div class="data_star" v-if="product.total_score > 0 && product.total_review_count > 0">
          <div class="only_star"></div>
          <em>{{ (product.total_score / product.total_review_count) | ceil(1) }}</em>
        </div>
        <div class="data_star" v-else>
          <div class="only_star disabled"></div>
          <em>0</em>
        </div>
        <div class="data"><em>{{ product.total_sale_count | kUnit | comma }}</em>개 판매</div>
        <div class="data">
          <a>
            <nuxt-link :to="{ path: `/product/${product.id}`, hash: '#nav_review'}">
              <em>{{ product.total_review_count | kUnit | comma }}</em>개의 리뷰
            </nuxt-link>
          </a>
        </div>
      </div>
    </div>
    </v-container>
    <div class="review_coll_top">
      <div class="list_tab_top">
        <v-container>
        <ul>
          <li :class="{on: abroadReviewOn && !reviewClosed}" @click="abroadReviewOn = true; koreanReviewOn = false; reviewClosed = false;">
            <a>해외 구매리뷰</a>
          </li>
          <li :class="{on: koreanReviewOn && !reviewClosed}" @click="abroadReviewOn = false; koreanReviewOn = true; reviewClosed = false;">
            <a>국내 구매리뷰</a>
          </li>
        </ul>
        <div class="open_btn" :class="{on: !reviewClosed}" @click="reviewClosed = !reviewClosed;" v-on:click="getProductReview">
          <a></a>
        </div>
        </v-container>
      </div>
      <div class="review_coll_bottom" :class="{on: !reviewClosed}">
        <v-container>
        <!-- Start 해외 리뷰 -->
        <div class="review_list_wrap" :class="{on: abroadReviewOn}">
          <div class="list_tab_bottom">
            <ul>
              <li :class="{on: textReviewOn}" @click="textReviewOn = true; photoReviewOn = false">
                <a>일반 리뷰</a>
              </li>
              <li :class="{on: photoReviewOn}" @click="textReviewOn = false; photoReviewOn = true">
                <a>포토 리뷰</a>
              </li>
            </ul>
          </div>
          <!-- Start 일반 리뷰 -->
          <swiper class="review_slide" :options="reviewSlide" :class="{on: textReviewOn}">

            <swiper-slide v-for="(chunk, idx) in abroadTextReviewChunks" :key="`abroad_text_review_chunks_${idx}`">
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="" v-for="review in chunk" :key="review.id">
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="review.id"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                        <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.writer_id }}</span>ㅣ <span>{{ review.created_at | date }}</span>ㅣ<span>옵션 : [{{ review.option_values }}] I {{ review.amount | comma }}개</span>
                      </div>
                      <div class="content_txt">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.translation_content ? review.translation_content : review.content }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
            <swiper-slide v-if="this.reviewLists.abroadTextReview.length < 1">
              <!-- 리뷰 없을시-->
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </ul>
              </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-white" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white hidden-xs" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white hidden-xs" slot="button-next"></div>
          </swiper>
          <!-- End 일반 리뷰 -->
          <!-- Start 포토 리뷰 -->
          <swiper class="review_slide" :options="reviewSlide" :class="{on: photoReviewOn}">

            <swiper-slide v-for="(chunk, idx) in abroadPhotoReviewChunks" :key="`abroad_photo_review_chunks_${idx}`">
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="" v-for="review in chunk" :key="review.id">
                    <div class="review_show_wrap__img_wrap">
                      <DefaultImage :imageUrl="review.image_url" />
                    </div>
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="review.id"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                        <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.name }}</span>ㅣ <span>{{ review.created_at | date }}</span>ㅣ <span>옵션 : [{{ review.option_values }}] I {{ review.amount | comma }}개</span>
                      </div>
                      <div class="content_txt">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.translation_content ? review.translation_content : review.content }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
            <swiper-slide v-if="this.reviewLists.abroadPhotoReview.length < 1">
              <!-- 리뷰 없을시-->
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </ul>
              </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-white" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white hidden-xs" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white hidden-xs" slot="button-next"></div>
          </swiper>
          <!-- End 포토 리뷰 -->
        </div>
        <!-- End 해외 리뷰 -->
        <!-- Start 국내 리뷰 -->
        <div class="review_list_wrap":class="{on: koreanReviewOn}">
          <div class="list_tab_bottom">
            <ul>
              <li :class="{on: textReviewOn}" @click="textReviewOn = true; photoReviewOn = false">
                <a>일반 리뷰</a>
              </li>
              <li :class="{on: photoReviewOn}" @click="textReviewOn = false; photoReviewOn = true">
                <a>포토 리뷰</a>
              </li>
            </ul>
          </div>
          <!-- Start 일반 리뷰 -->
          <swiper class="review_slide" :options="reviewSlide" :class="{on: textReviewOn}">
            <swiper-slide v-for="(chunk, idx) in koreanTextReviewChunks" :key="`korean_text_review_chunks_${idx}`">
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="" v-for="review in chunk" :key="review.id">
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="review.id"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                        <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.name }}</span>ㅣ <span>{{ review.created_at | date }}</span>ㅣ<span>옵션 : [{{ review.option_values }}] I {{ review.amount | comma }}개</span>
                      </div>
                      <div class="content_txt">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.content }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
            <swiper-slide v-if="this.reviewLists.koreanTextReview.length < 1">
              <!-- 리뷰 없을시-->
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </ul>
              </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-white" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white hidden-xs" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white hidden-xs" slot="button-next"></div>
          </swiper>
          <!-- End 일반 리뷰 -->
          <!-- Start 포토 리뷰 -->
          <swiper class="review_slide" :options="reviewSlide" :class="{on: photoReviewOn}">
            <swiper-slide v-for="(chunk, idx) in koreanPhotoReviewChunks" :key="`korean_photo_review_chunks_${idx}`">
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="" v-for="review in chunk" :key="review.id">
                    <div class="review_show_wrap__img_wrap">
                      <DefaultImage :imageUrl="review.review_images[0]" />
                    </div>
                    <div class="review_show_wrap__info_wrap">
                      <div>
                        <Star :readonly="true"
                              :disabled="true"
                              :rateNumber="review.id"
                              :star="review.score"></Star>
                        <span class="m_l_10">{{ review.score }}점</span>
                        <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.name }}</span>ㅣ <span>{{ review.created_at | date }}</span>ㅣ <span>옵션 : [{{ review.option_values }}] I {{ review.amount | comma }}개</span>
                      </div>
                      <div class="content_txt">
                        <div class="review_show_wrap__info_wrap_text">
                          {{ review.content }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
            <swiper-slide v-if="this.reviewLists.koreanPhotoReview.length < 1">
              <!-- 리뷰 없을시-->
              <div class="review_show_content">
                <ul class="review_show_wrap__list">
                  <li class="empty_text_wrap">리뷰가 존재하지 않습니다.</li>
                </ul>
              </div>
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-white" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-white hidden-xs" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-white hidden-xs" slot="button-next"></div>
          </swiper>
          <!-- End 포토 리뷰 -->
        </div>
        <!-- End 국내 리뷰 -->
        <div class="but_wrap square_btn m_t_10 m_b_20">
          <nuxt-link class="gray_line_light_but" :to="{ path: `/product/${product.id}`, hash: '#nav_review'}">
            자세히 보기
          </nuxt-link>
        </div>
        </v-container>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'ProductSummary',
  props: {
    product: Object,
  },
  data: () => ({
    dataLoaded: false,
    textReviewOn: true,
    photoReviewOn: false,
    koreanReviewOn: false,
    abroadReviewOn: false,
    reviewClosed: true,
    reviewLists: {
      koreanTextReview: [],
      koreanPhotoReview: [],
      abroadTextReview: [],
      abroadPhotoReview: [],
    },
    reviewSlide: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    },
  }),
  computed: {
    koreanTextReviewChunks() {
      return _.chunk(Object.values(this.reviewLists.koreanTextReview), 2);
    },
    koreanPhotoReviewChunks() {
      return _.chunk(Object.values(this.reviewLists.koreanPhotoReview), 2);
    },
    abroadTextReviewChunks() {
      return _.chunk(Object.values(this.reviewLists.abroadTextReview), 2);
    },
    abroadPhotoReviewChunks() {
      return _.chunk(Object.values(this.reviewLists.abroadPhotoReview), 2);
    },
  },
  created() {
    // 디폴트는 국내리뷰 탭 활성화이고, 국내리뷰가 없고 해외리뷰만 있으면 해외리뷰 탭 활성화
    if (this.product.review_count === 0 && this.product.abroad_review_count > 0) {
      this.koreanReviewOn = false;
      this.abroadReviewOn = true;
    }
  },
  methods: {
    async getKoreanReview(reviewType) {
      const data = {
        id: this.product.id,
        review_page: 1,
        review_page_size: 6,
        review_type: reviewType,
      };
      const res = await this.$axios.get(`product/${data.id}/reviews`, { params: data });

      if (reviewType === 'TEXT') {
        this.reviewLists.koreanTextReview = res.data.data.reviews;
      } else if (reviewType === 'PHOTO') {
        this.reviewLists.koreanPhotoReview = res.data.data.reviews;
      }
    },
    async getAbroadReview(reviewType) {
      const data = {
        id: this.product.id,
        page: 1,
        page_size: 6,
        review_type: reviewType,
      };
      const res = await this.$axios.get(`product/${data.id}/abroad-reviews`, { params: data });

      if (reviewType === 'TEXT') {
        this.reviewLists.abroadTextReview = res.data.data.reviews;
      } else if (reviewType === 'PHOTO') {
        this.reviewLists.abroadPhotoReview = res.data.data.reviews;
      }
    },
    getProductReview() {
      if (!this.abroadReviewOn && !this.koreanReviewOn) {
        this.koreanReviewOn = true;
      }
      if (!this.reviewClosed && !this.dataLoaded) {
        this.getKoreanReview('TEXT');
        this.getKoreanReview('PHOTO');
        this.getAbroadReview('TEXT');
        this.getAbroadReview('PHOTO');
        this.dataLoaded = true;
      }
    },
  },
};
</script>
