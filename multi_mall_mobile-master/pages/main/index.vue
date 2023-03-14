<template>
  <client-only>
  <div>
    <Header></Header>
    <MainSlide/>

    <main-article></main-article>

    <div class="section_02">
      <v-container>
        <span class="sec_main_title new">MOLLY의 새로운 아이템!</span>
      </v-container>
      <div class="list_warp price">
        <div class="product_list_wrap">
          <ul>
            <li class="list_inner" v-for="(product, i) in product_list" :key="i">
              <product-price-group-summary :product="product" :sizeSmall="true" ></product-price-group-summary>
            </li>
          </ul>
        </div>
      </div>
      <!-- Infinite Scroll Start -->
      <div>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results">상품이 없습니다.</div>
          <div slot="error" slot-scope="{ trigger }">
            상품을 불러오는데 오류가 발생했습니다.
            <a href="javascript:;" @click="trigger">다시 불러오기</a>
          </div>
        </infinite-loading>
      </div>
      <!-- Infinite Scroll End -->

    </div>
    <Footer></Footer>
    <Dockbar></Dockbar>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/main/index.js"></script>
