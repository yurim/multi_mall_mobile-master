<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="product_store_wrap">
        <div class="top_sub_wrap">
          <div class="category_title">관련카테고리</div>
          <div class="category_list">
            <ul>
              <li><a href="javascript:;">패션의류</a></li>
              <li><a href="javascript:;">여성의류</a></li>
              <li><a href="javascript:;">원피스</a></li>
            </ul>
          </div>
        </div>
        <div class="top_sub_wrap_item">
          <ul>
            <li><a href="javascript:;">패션의류1</a></li>
            <li><a href="javascript:;">패션의류2</a></li>
            <li><a href="javascript:;">패션의류3</a></li>
            <li><a href="javascript:;">패션의류4</a></li>
            <li><a href="javascript:;">패션의류5</a></li>
            <li><a href="javascript:;">패션의류6</a></li>
            <li><a href="javascript:;">패션의류7</a></li>
            <li><a href="javascript:;">패션의류8</a></li>
            <li><a href="javascript:;">패션의류9</a></li>
            <li><a href="javascript:;">패션의류10</a></li>
          </ul>
        </div>
        <div class="top_sub_wrap_item">
          <div class="category_title">가격대</div>
          <div class="radio_box">
            <div class="radio_wrap">
              <input type="radio" id="all">
              <label for="all">전체</label>
              <input type="radio" id="10000">
              <label for="10000">10,000원 이하</label>
              <input type="radio" id="50000">
              <label for="50000">10,000원 ~ 50,000원</label>
              <input type="radio" id="100000">
              <label for="100000">50,000원 ~ 100,000원</label>
              <input type="radio" id="300000">
              <label for="300000">100,000원 ~ 300,000원</label>
            </div>
          </div>
        </div>
        <div>
          <ul class="top_range_wrap">
            <!--  todo: 페이지별 li에 .on 추가-->
            <li class="on"><a href="javascript:;">최신순</a></li>
            <li><a href="javascript:;">판매량순</a></li>
            <li><a href="javascript:;">낮은가격순</a></li>
            <li><a href="javascript:;">높은가격순</a></li>
          </ul>
          <div class="list_warp">
            <!--제품이 없을때-->
            <!--<span class="empty_text_wrap">제품이 존재하지 않습니다.</span>-->
            <ul>
              <li>
                <a href="javascript:;">
                  <div class="img_wrap">
                    <img src="@/assets/img/product_default_img.png" alt="제품 이미지">
                  </div>
                  <div class="text_wrap">
                    <div class="store_wrap">홍길동샵</div>
                    <div class="title_wrap">플라워 드레스 001 플라워 플라워 드레스 001</div>
                    <div class="price_wrap">
                      <div class="discount-percentage">43%</div>
                      <div class="sale-price">32,000원</div>
                      <div class="base-price">32,000원</div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <div class="img_wrap">
                    <img src="@/assets/img/product_default_img.png" alt="제품 이미지">
                  </div>
                  <div class="text_wrap">
                    <div class="store_wrap">홍길동샵</div>
                    <div class="title_wrap">플라워 드레스 001 플라워 플라워 드레스 001</div>
                    <div class="price_wrap">
                      <div class="discount-percentage">43%</div>
                      <div class="sale-price">32,000원</div>
                      <div class="base-price">32,000원</div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <!--todo: 페이지네이션 추가해주세요 -->
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>

<script>
export default {
  name: 'index',
};
</script>
