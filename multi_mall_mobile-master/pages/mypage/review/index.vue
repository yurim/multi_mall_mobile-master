<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="mypage_info_wrap">
        <div class="main_title_wrap">
          <h2>마이페이지</h2>
        </div>

        <!-- *** 마이페이지 현황 START *** -->
        <MypageCondition></MypageCondition>
        <!-- *** 마이페이지 현황 END *** -->

        <!-- *** 마이페이지 탭 메뉴 START *** -->
        <TopTabNav></TopTabNav>
        <!-- *** 마이페이지 탭 메뉴 END *** -->

        <div>
          <h3>MY 리뷰</h3>
          <!-- *** 리뷰 탭 START *** -->
          <div class="mypage_tab_nav">
            <ul>
              <li :class="{ on: tabType === 'write' }"><a @click="tabType = 'write'">작성가능 리뷰</a></li>
              <li :class="{ on: tabType === 'wrote' }"><a @click="tabType = 'wrote'">내가 쓴 리뷰</a></li>
            </ul>
          </div>
          <!-- *** 리뷰 탭 END *** -->

          <!-- *** 작성가능 리뷰 START *** -->
          <div class="review_wrap" v-if="tabType === 'write'">
            <ul>
              <li v-if="orderProducts.length > 0" v-for="(orderProduct, i) in orderProducts" :key="`review_${i}`">
                <div class="info_title">{{ orderProduct.product_name }}</div>
                <div class="info_txt">[{{ orderProduct.product_option_names }}]  I  {{ orderProduct.amount | comma }}개</div>
                <div class="btn_s_right">
                  <a class="line_but" v-on:click="popReview(orderProduct)">리뷰 쓰기</a>
                </div>
              </li>
              <!-- 리뷰 없을 시-->
              <li class="empty_text_wrap" v-else>작성가능한 리뷰가 존재하지 않습니다.</li>
            </ul>
            <!-- 페이지네이션 -->
            <div class="swiper-pagination">
              <Pagenation :total-count="orderProductTotalCount" :page-size="orderProductPageSize" :default-page="1"
                          :page-key-name="'order_product_page'" :page-size-key-name="'order_product_page_size'"
                          :onPage="onOrderProductPage"></Pagenation>
            </div>
          </div>
          <!-- *** 작성가능 리뷰 END *** -->

          <!-- *** 내가 쓴 리뷰 START *** -->
          <div class="review_info_list" v-else>
            <ul>
              <li v-if="reviews.length > 0" v-for="(review, i) in reviews" :key="`review_${i}`">
                <div class="review_info">
                  <div class="rate_wrap">
                    <Star :readonly="true" :disabled="true" :star="review.score" :rateNumber="i" />
                    <span class="point"><span>{{ review.score }}</span>점</span>
                    <!-- BEST 선정시-->
                    <span class="main_red" v-if="review.is_best">BEST</span>
                  </div>
                  <div class="date_wrap">
                    <div class="info_title">{{ review.product_name }}</div>
                    <div class="info_txt">{{ review.store_name_kor }} ㅣ {{ review.created_at | date }}</div>
                    <div class="info_txt">[{{ review.option_values }}] I {{ review.amount | comma }}개</div>
                  </div>
                  <div class="text_wrap">
                    <div class="user_txt">
                      <p>{{ review.content }}</p>
                    </div>
                    <div class="admin_txt" v-if="review.reply_content">
                      <p><em>판매자답변</em> {{ review.reply_content }}</p>
                    </div>
                  </div>
                </div>
                <div class="review_img" v-if="review.review_type === 'PHOTO' && review.review_images.length > 0"
                     @click="showReviewPopup(review)">
                  <DefaultImage :imageUrl="review.review_images[0]" />
                </div>
              </li>
              <!-- 리뷰 없을 시-->
              <li class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</li>
            </ul>

            <!-- 페이지네이션 -->
            <div class="swiper-pagination">
              <Pagenation :total-count="reviewTotalCount" :page-size="reviewPageSize" :default-page="1"
                          :page-key-name="'review_page'" :page-size-key-name="'review_page_size'"
                          :onPage="onReviewPage"></Pagenation>
            </div>
          </div>
          <!-- *** 내가 쓴 리뷰 END *** -->
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/mypage/review/index.js"></script>
