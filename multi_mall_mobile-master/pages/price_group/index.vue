<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>
      <div class="product_store_wrap">

        <div class="top_sub_menu_wrap">
          <div class="top_sub_menu_wrap_item" v-if="temp && temp.q">
            <b>'<span class="brand_color">{{ temp.q }}</span>'의 검색결과</b><br/>
            <span class="main_gray font_sm" v-if="totalCount !== null">총 '<span class="brand_color">{{ totalCount | comma }}</span>' 건의 상품이 검색 되었습니다.</span>
          </div>

          <div class="top_sub_menu_wrap_item top_category_wrap p_b_0">
            <div class="category_title">현재 카테고리</div>
            <ul class="category_tree_wrap">
              <template v-if="categoryTree.length >= 1">
                <li>
                  <nuxt-link to="/price_group">전체보기</nuxt-link>
                </li>
                <li v-for="(category, i) in categoryTree" :key="i">
                  <a v-on:click="clickCategory(category)">{{ category.name }}</a>
                </li>
              </template>
              <template v-else>
                <li class="font_16 color_main_01 f_bold p_b_10">전체 카테고리</li>
              </template>
            </ul>
          </div>
          <div class="top_sub_menu_wrap_item top_category_wrap" v-if="childCategories.length > 0">
            <ul class="category_list">
              <li v-for="category in childCategories" :key="category.id">
                <a v-on:click="clickCategory(category)">{{ category.name }}</a>
              </li>
            </ul>
          </div>

          <div class="top_sub_menu_wrap_item">
            <div class="select_txt_wrap">
              <div class="category_title">가격대</div>
              <select dir="rtl" v-on:change="onSearchFilter" v-model="filter_price">
                <template v-for="type in search_filter_price">
                  <option name="filterPrice" :id="type.value" :value="type.value">
                    {{ type.text }}
                  </option>
                </template>
              </select>
            </div>
          </div>
        </div>
      </div>
    </v-container>
    <div class="list_warp price">
      <div class="product_list_wrap">
        <ul>
          <li class="list_inner" v-for="(product, i) in product_list" :key="i">
            <product-price-group-summary :product="product" :sizeSmall="true"></product-price-group-summary>
          </li>
        </ul>
      </div>
    </div>
    <!-- Infinite Scroll Start -->
    <div>
      <infinite-loading @infinite="infiniteHandler" spinner="spiral">
        <div slot="no-more"></div>
        <div slot="no-results">제품이 존재하지 않습니다.</div>
        <div slot="error" slot-scope="{ trigger }">
          상품을 불러오는데 오류가 발생했습니다.
          <a href="javascript:;" @click="trigger">다시 불러오기</a>
        </div>
      </infinite-loading>
    </div>
    <!-- Infinite Scroll End -->
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
<script src="@/assets/javascripts/price_group/index.js"></script>
