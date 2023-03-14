<template>
  <div>
    <Header></Header>
    <v-container>
      <!-- *** 가격비교 그룹 검색결과일때 페이지 START *** -->
      <div class="list_title_wrap m_t_40 m_b_10">
        <span>검색한 이미지</span>
      </div>
      <div class="image_search_group line_bottom">
        <div class="search_image_wrap">
          <div class="img_wrap">
            <img :src="uploadFileUrl? uploadFileUrl : require('@/assets/img/search_default_img.png')"/>
          </div>
          <div class="file_name">{{ uploadFileName ? uploadFileName : '선택된 이미지가 없습니다' }}</div>
        </div>
      </div>

      <div class="product_store_wrap">
        <div class="top_sub_wrap_item m_b_10">
          <div class="category_title">이미지 검색결과</div>
        </div>
        <div class="list_warp price">
          <div class="product_list_wrap">
            <ul>
              <li v-for="(group, i) in groupList" :key="`group_${i}`" class="list_inner">
                <product-price-group-for-search :group="group" :sizeSmall="true"></product-price-group-for-search>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Infinite Scroll Start -->
      <div>
        <v-container>
          <infinite-loading @infinite="infiniteHandler" spinner="spiral">
            <div slot="no-more"></div>
            <div slot="no-results">검색된 내용이 없습니다.</div>
            <div slot="error" slot-scope="{ trigger }">
              상품을 불러오는데 오류가 발생했습니다.
              <a href="javascript:" @click="trigger">다시 불러오기</a>
            </div>
          </infinite-loading>
        </v-container>
      </div>
      <!-- Infinite Scroll End -->

      <!-- *** 가격비교 그룹 검색결과일때 페이지 END *** -->
    </v-container>
    <!-- image_search_btn -> (가격비교 ,가격비교 검색결과) 페이지에서만 보여져야함 -->
    <div class="image_search_btn">
      <div class="image_search_box">
        <div class="search_btn" @click="uploadImage">
          <span class="image_search_icon"></span>
        </div>
      </div>
    </div>
    <Dockbar></Dockbar>
  </div>
</template>

<script src="@/assets/javascripts/price_group/search/index.js"></script>
