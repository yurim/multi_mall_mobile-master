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
          <h3>문의하기</h3>
          <div class="review_wrap">
            <!-- *** 문의 리스트 START *** -->
            <ul>
              <li v-for="questionGroup in productInquiryList">
                <div class="main_gray">
                  <span class="brand_color" v-if="questionGroup[0].is_replied">답변완료</span>
                  <span class="main_gray" v-else>답변미완료</span>
                  <div class="square_but_wrap pull-right">
                    <a class="line_but" @click="deleteQuestion(questionGroup[0].id)">삭제</a>
                  </div>
                </div>
                <div class="date_wrap">
                  <div class="info_title brand_color">{{ questionGroup[0].store_name_kor }}</div>
                  <div class="info_title">{{ questionGroup[0].product_name }}</div>
                </div>
                <div class="inquiry_wrap" v-for="question in questionGroup">
                  <div><span class="brand_color">Q</span> {{ question.content }}</div>
                  <div v-if="question.is_replied" v-for="answer in question.answers">
                    <span class="main_red">A</span> {{ answer.content }}
                    <div class="info_txt">{{ answer.created_at | date }}</div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- *** 문의 리스트 END *** -->
          </div>
          <div class="swiper-pagination">
            <Pagenation :total-count="totalCount" :page-size="pageSize" :default-page="defaultPage"
                        :page-key-name="'page'" :page-size-key-name="'page_size'"
                        :onPage="onProductInquiryListPage"></Pagenation>
          </div>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/mypage/inquiry/product/index.js"></script>
