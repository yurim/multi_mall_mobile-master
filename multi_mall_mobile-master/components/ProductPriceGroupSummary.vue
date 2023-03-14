<template>
  <div class="list_box" :class="{on : !product.product_price_group}">
    <v-container>
      <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">
        <div class="img_wrap"><DefaultImage :imageUrl="product.main_image"/></div>
      </nuxt-link>
      <div class="text_wrap">
        <div class="store_wrap">
          <nuxt-link :to="`/store/${product.store_id}`"
                     :class="{'lowest_price': product.product_price_group && product.product_price_group.lowest_product_id === product.id}">
            {{ product.store_name }}
          </nuxt-link>
        </div>
        <div class="title_wrap">
          <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">{{ product.name }}</nuxt-link>
        </div>
        <div class="price_wrap">
          <div class="cost-price" v-if="product.abroad_price">
            <span>{{ product.store_name }}</span>
            <div class="d_ib pull-right">
              <template v-if="product.abroad_price.price > 0">{{ product.abroad_price.price | comma }} 원</template>
              <template v-else>-</template>
            </div>
          </div>
          <div class="sale-price" v-if="!product.display_only">
            <span>몰리</span>
            <div class="d_ib pull-right">
              <em>{{ (product.discount_price ? product.discount_price : product.price) | comma }}</em> 원
            </div>
          </div>
        </div>
        <div class="reaction">
          <div class="data_star">
            <div class="only_star" :class="product.total_score > 0 ? '': 'disabled'"></div>
            <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count) || 0) | ceil(1) }}</em>
          </div>
          <div class="data"><em>{{ product.sale_count | kUnit | comma }}</em>개 판매</div>
          <div class="data">
            <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">
              <em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰
            </nuxt-link>
          </div>
        </div>
      </div>
      <!-- *** 가격비교그룹이 존재하는 경우 *** -->
      <div class="review_coll_top" v-if="product.product_price_group">
        <div class="list_tab_top">
          <ul>
            <li><a @click="accodianBtn"><span>가격비교 상품 </span>
              <span>(총 <em class="color_main_01">{{ product.product_price_group.total_product_count | comma }}</em>개 매장)</span>
            </a></li>
          </ul>
          <div class="open_btn" :class="{on : accodianOpen}"><a @click="accodianBtn"></a></div>
        </div>
        <div class="review_coll_bottom" :class="{on : accodianOpen}">
          <div class="compare_wrap">
            <table>
              <colgroup>
                <col width="30">
              </colgroup>
              <tbody>
              <tr v-for="(item, i) in product.product_price_group.group_products" :key="i">
                <td><span class="font_16" :class="i === 0 ? 'f_bold' : 'color_gray_9D'">{{ i + 1 }}</span></td>
                <td>
                  <nuxt-link :to="`/product/${item.id}`">
                    <ul class="compare_product_list">
                      <li>
                        <div class="store_title">
                          <span :class="{ lowest_price : i === 0 }">{{ item.store_name }}</span>
                        </div>
                        <div class="delivery_date"><span>배송 소요일:</span>평균 {{ item.avg_delivery_days ? item.avg_delivery_days : 20 }}일</div>
                      </li>
                      <li>
                        <div class="color_gray_9D">직접 구매가 + (배송비)</div>
                        <div class="store_basiclist_item">
                          <template v-if="item.abroad_price && item.abroad_price.price > 0">
                            <b class="font_14">{{ item.abroad_price.price | comma }}</b>원
                            <span>&nbsp;+&nbsp;
                              <template v-if="item.abroad_price.delivery_fee">
                                (<span class="color_gray_9D">{{ item.abroad_price.delivery_fee | comma }}</span> 원)
                              </template>
                              <template v-else>
                                <span class="color_gray_9D">무료배송</span>
                              </template>
                            </span>
                          </template>
                          <template v-else><em>-</em></template>
                        </div>
                      </li>
                      <li>
                        <div class="color_gray_9D">몰리 구매가</div>
                        <div class="store_basiclist_item">
                          <div class="basiclist_price font_14 text-right" v-if="!item.display_only">
                            <b :class="{brand_color : i === 0}">{{(item.discount_price ? item.discount_price : item.price) | comma}} 원</b>
                          </div>
                          <div class="basiclist_price text-right" v-else><em>-</em></div>
                        </div>
                      </li>
                    </ul>
                  </nuxt-link>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="compare_price_chart_wrap">
              <ComparePriceChart :lowestProduct="product.product_price_group.group_products[0]"
                                 :highestProduct="product.product_price_group.highest_product"
                                 :sizeSmall="sizeSmall"></ComparePriceChart>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'ProductPriceGroupSummary',
  props: {
    product: Object,
    sizeSmall: Boolean,
  },
  data: () => ({
    accodianOpen: false,
  }),
  methods: {
    accodianBtn() {
      this.accodianOpen = !this.accodianOpen;
    },
  },
};
</script>
