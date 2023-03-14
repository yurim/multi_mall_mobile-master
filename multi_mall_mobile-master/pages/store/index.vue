<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap m_t_40">
          <span>STORE</span>
          <ul class="tab_menu_wrap">
            <li><a v-on:click="onChangeStoreList()" :class="store_type ? '' : 'on'">전체</a></li>
            <li v-for="type in storeTypeList" v-if="type.key !== 'ROAD' && type.key !== 'BRAND'" :key="`storeType_${type.key}`">
              <a v-on:click="onChangeStoreList(type.key)" :class="type.key === store_type ? 'on' : ''" >
                {{ type.value }}
              </a>
            </li>
          </ul>
        </div>

        <div class="list_title_wrap m_t_0 m_b_20">
          <ul class="tab_menu_wrap">
            <li><a v-on:click="onSortFilter('best')" :class="filter_sort === 'best' ? 'on' : ''">인기순</a></li>
            <li><a v-on:click="onSortFilter('recent')" :class="filter_sort === 'recent' ? 'on' : ''">최신순</a></li>
<!--            <li><a v-on:click="onSortFilter('recommend')" :class="filter_sort === 'recommend' ? 'on' : ''">추천순</a></li>-->
          </ul>
        </div>

        <ul class="store_list_wrap">
          <li v-for="store in storeList" :key="store.id" v-on:click="pageToRedirect('store', store.id)" class="list_inner">
            <div class="store_info_wrap">
              <div class="store_info_wrap__img contain">
                <a>
                  <DefaultImage :imageUrl="store.profile" />
                </a>
              </div>
              <div class="store_info_wrap__title_wrap">
                <a class="store_info_wrap__title">{{ store.name }}</a>
                <div>{{ store.category ? '-' : '' }} {{ store.category }} <!-- TODO Style - 아직 연동 안됨 --> <!--스타일--></div>
                <div>{{ store.age_target.length > 0 ? '-' : '' }} {{ store.age_target_str.join(', ') }}</div>
                <!-- TODO TAGS - 연동안됨 -->
                <!-- <div>- #린넨 #블라우스 #슬랙스 #수영복</div> -->
              </div>
              <!-- TODO 스토어 찜에 대한 기능 필요(현재 관련된 모델링X) -->
<!--              <div class="store_info_wrap__icon">-->
<!--                <a>-->
<!--                  <img alt="스토어싫어요 아이콘" src="@/assets/img/user/icon/like_off.png">-->
                  <!-- <img alt="스토어좋아요 아이콘" src="@/assets/img/user/icon/like_on.png"> -->
<!--                </a>-->
<!--              </div>-->
            </div>
            <div class="store_product_wrap" v-if="store.represent_products.length > 0">
              <client-only>
                <a v-for="product in store.represent_products" :key="`${product.name}_${product.id}`" :id="`product_${product.id}`" v-on:click.stop="pageToRedirect('product', product.id)">
                  <DefaultImage :imageUrl="product.main_image" />
                </a>
              </client-only>
            </div>
            <div class="store_product_wrap" v-else>
              <div class="empty_text_wrap">등록된 대표상품이 없습니다.</div>
            </div>
          </li>
        </ul>
<!--        <div class="store_list_wrap" style="box-shadow: 1px 4px 10px -6px; padding: 30px 0;">-->
        <div class="store_list_wrap" v-if="storeList.length === 0" style="box-shadow: 1px 4px 10px -6px; padding: 30px 0;">
          <div class="empty_text_wrap">등록된 매장이 없습니다.</div>
        </div>
      </div>

    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/store/index.js"></script>
