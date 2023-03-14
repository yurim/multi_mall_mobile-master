<template>
  <div>
    <Header></Header>
    <v-container>
      <!-- *** 상품 이미지 슬라이드 START *** -->
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide slide_01">
            <div class="img_wrap">
              <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
                <swiper-slide class="slide-0"><DefaultImage :imageUrl="product.main_image" /></swiper-slide>

                <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`" :key="`slide_${index}`">
                  <DefaultImage :imageUrl="item.image" />
                </swiper-slide>
                <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
              </swiper>

              <!-- swiper2 Thumbs -->
              <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
                <swiper-slide class="slide-0">
                  <div class="img_bg_wrap" v-bind:style="{ backgroundImage: `url(${ product.main_image ? product.main_image : require('@/assets/img/product_default_img.png') })` }" ></div>
                </swiper-slide>
                <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`"
                              :key="`thumbs_${index}`">
                  <DefaultImage :imageUrl="item.image" />
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <!-- *** 상품 이미지 슬라이드 END *** -->
      <div class="product_show_wrap compare_group_wrap">
        <div>
          <div class="text_wrap">
            <div class="store_wrap">
              <span :class="{lowest_price: product.id === productPriceGroup.lowest_product_id}">{{ product.store_name_kor }}</span>
            </div>
            <div class="title_wrap">{{ product.name }}</div>

            <div class="reaction">
              <div class="data_star" v-if="product.total_score > 0 && (product.total_review_count + product.abroad_total_review_count) > 0">
                <div class="only_star"></div>
                <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count)) | ceil(1) }}</em>
              </div>
              <div class="data_star" v-else>
                <div class="only_star disabled"></div>
                <em>0</em>
              </div>
              <div class="data"><em>{{ product.total_sale_count | kUnit | comma }}</em>개 판매</div>
              <div class="data">
                <nuxt-link :to="`/product/${ product.id }`"><em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰</nuxt-link>
              </div>
            </div>

            <ul class="option_list_wrap">
              <li>
                <div class="price_btn_wrap m_b_20">
                  <ul class="even_child_wrap molly_list">
                    <!-- 구매불가 : 몰리판매불가 o, 해외상품여부 x|o, 링크있음 x -->
                    <template v-if="lowest_btn_type === '100' || lowest_btn_type === '110'">
                      <li class="w_100">
                        <span class="unsell_product">판매중지된 상품입니다.</span>
                      </li>
                    </template>
                    <template v-else>
                      <li v-if="product.detail_url">
                        <div>직접 사러가기</div>
                        <a :href="product.detail_url" target="_blank">
                          <div v-if="product.abroad_price && product.abroad_price.price > 0"><b>{{ product.abroad_price.price | comma }}</b> 원</div>
                          <span>{{ product.store_name_kor }} 결제</span>
                        </a>
                      </li>
                      <li class="molly" v-if="!product.display_only">
                        <div class="color_main_01">
                          몰리에서 사기
                          <span class="color_black font_12">(<span class="color_main_01">{{ product.saving_rate }}</span>% 적립)</span>
                        </div>
                        <nuxt-link :to="`/product/${ product.id }`">
                          <div><b>{{ (product.discount_price ? product.discount_price : product.price) | comma }}</b> 원</div>
                          <span>몰리에서 결제</span>
                        </nuxt-link>
                      </li>
                    </template>
                  </ul>
                  <div v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'" class="explain d_ib_100">*옵션에 따라 가격이 변동될 수 있습니다.</div>
                </div>
              </li>
              <li v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                <div class="question_wrap">
                  <ul class="font_12">
                    <li>
                      <div class="question color_main_01">Q. 몰리에서 사는게 왜 더 비싼가요?</div>
                      <div class="answer">몰리의 판매가는  판매원가 + 최대 50%(상품 하자 및 반품책임 수수료) + 무게에 따른 배송비를 포함하여
                        <em>구매대행 형식</em>으로 판매를 진행하기 때문에 가격이 비싸집니다.</div>
                    </li>
                  </ul>
                </div>
              </li>
              <li v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                <div class="shipping_information_wrap line_bottom">
                  <ul>
                    <li class="font_14 p_b_10 m_t_10"><b>배송 정보</b></li>
                    <li v-if="product.detail_url">
                      <div class="info_wrap">
                        <div class="icon_wrap">
                          <div class="order_icon"></div>
                        </div>
                        <div class="shipping_information_wrap__title">
                          <b>{{ product.store_name_kor }}</b>
                        </div>
                        <div class="shipping_information_wrap__fee">
                          <template v-if="product.abroad_price && product.abroad_price.delivery_fee">
                            <span class="color_gray_9D">배송비</span> <span class="f_bold">{{ product.abroad_price.delivery_fee | comma }} 원</span><br>
                          </template>
                          <template v-else><span class="color_gray_9D">배송비</span> <span class="f_bold">무료배송</span><br></template>
                          <div class="explain m_b_0">영업일 기준 평균 <em class="c_black">{{ product.avg_delivery_days ? product.avg_delivery_days : 20 }}</em>일 내 도착</div>
                        </div>
                      </div>
                    </li>
                    <li v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                      <div class="info_wrap">
                        <div class="icon_wrap">
                          <div class="order_icon"></div>
                        </div>
                        <div class="shipping_information_wrap__title">
                          <b class="color_main_01">몰리</b>
                        </div>
                        <div class="shipping_information_wrap__fee">
                          <template v-if="product.delivery_info && (product.delivery_info.default_fee > 0)">
                            <span class="color_gray_9D">배송비</span> {{product.delivery_info.default_fee | comma}}원
                          </template>
                          <template v-else>
                            <span class="color_gray_9D">배송비</span> <span><span class="color_main_01 f_bold">무조건</span> <span class="f_bold">무료배송</span></span><br>
                          </template>
                          <div class="explain m_b_0">발송 처리 이후 평균 <em class="c_black">25</em>일 내 도착</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="d_ib_100 explain">
                    *배송 소요 일수는 대략적인 정보이며, 해외 판매처 및 국내 통관절차 등으로 인하여 소요 시간이 변동될 수 있는 점 양해 부탁드립니다.</div>
                </div>
              </li>
              <li>
                <div class="compare_price_chart_wrap">
                  <ComparePriceChart :lowestProduct="mainGroupProducts[0]" :highestProduct="productPriceGroup.highest_product" :sizeSmall="true" ></ComparePriceChart>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="compare_list_wrap">

          <div class="m_b_20"><a>가격비교 상품 <span class="color_gray_9D">(총 <em class="color_main_01">{{ groupProductTotalCount }}</em>개 매장)</span></a></div>
          <div class="compare_wrap">
            <table>
              <colgroup>
                <col width="30">
              </colgroup>
              <tbody>
              <tr v-for="(data, i) in mainGroupProducts" v-if="i < 5">
                <td class="f_bold" :class="i === 0 ? 'f_bold' : 'color_gray_9D' ">{{ i + 1 }}</td>
                <td>
                  <ul class="compare_product_list">
                    <li>
                      <nuxt-link :to="`/product/${ data.id }`" class="flex">
                        <div class="store_title under_line">
                          <span :class="[i === 0 ? 'lowest_price' : '']">{{ data.store_name }}</span>
                        </div>
                        <div class="delivery_date"><span>배송 소요일:</span>평균 {{ data.avg_delivery_days ? data.avg_delivery_days : 20 }}일</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <a :href="data.detail_url" target="_blank" class="flex">
                        <div class="color_gray_9D">직접 구매가 + (배송비)</div>
                        <div class="under_line">
                          <template v-if="data.abroad_price && data.abroad_price.price > 0 && data.detail_url">
                            <div>
                              <b class="font_14">{{ data.abroad_price.price | comma }}원</b>
                              <template v-if="data.abroad_price.delivery_fee">
                                <span class="color_gray_9D">+&nbsp;({{ data.abroad_price.delivery_fee | comma }}원)</span>
                              </template>
                              <template v-else><span class="color_gray_9D">+&nbsp;무료배송</span></template>
                            </div>
                          </template>
                          <template v-else-if="data.abroad_price && data.abroad_price.price > 0">
                            <span class="color_gray_70"> {{ data.abroad_price.price | comma }}원</span>
                            &nbsp;+&nbsp;
                            <template v-if="data.abroad_price.delivery_fee">
                              ({{ data.abroad_price.delivery_fee | comma }}원)
                            </template>
                            <template v-else>무료배송</template>
                          </template>
                          <template v-else>
                            <span class="color_gray_70">-</span>
                          </template>
                        </div>
                      </a>
                    </li>
                    <li>
                      <nuxt-link :to="`/product/${ data.id }`" class="flex">
                        <div class="color_gray_9D">몰리 구매가</div>
                        <div class="under_line">
                          <div class="text-right" v-if="!data.display_only">
                            <span class="f_bold font_14" :class="[i === 0 ? 'brand_color' : '']">{{ data.price | comma }} 원</span>
                          </div>
                          <div class="text-right" v-else><span class="color_gray_70">-</span></div>
                        </div>
                      </nuxt-link>
                    </li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 탭메뉴 START -->
        <div id="stickyNav" class="product_tab_nav">
          <div>
            <scrollactive class="my_nav" :modify-url="false" :offset="121" active-class="on">
              <a href="#nav_group_products" class="scrollactive-item on">가격비교 상품</a>
              <a href="#nav_review" class="scrollactive-item">상품 구매리뷰</a>
              <a v-if="product.content" href="#nav_detail" class="scrollactive-item">상품상세</a>
            </scrollactive>
          </div>
        </div>
        <!-- 탭메뉴 END -->
        <div class="product-info-wrap">

          <!-- 가격비교 상품 -->
          <div class="info_content" id="nav_group_products">
            <div class="list_warp price">
              <div class="product_list_wrap">
                <ul>
                  <li class="list_inner" v-for="data in productPriceGroup.products" :class="{'product_lowest_price': data.id === productPriceGroup.lowest_product_id}">
                    <div class="list_box">
                      <v-container>
                        <nuxt-link :to="`/product/${data.id}`">
                          <div class="img_wrap">
                            <DefaultImage :imageUrl="data.main_image"></DefaultImage>
                          </div>
                        </nuxt-link>
                        <div class="text_wrap">
                          <div class="store_wrap m_t_0">
                            <nuxt-link :to="`/store/${data.store_id}`">{{ data.store_name }}</nuxt-link>
                          </div>
                          <div class="title_wrap">
                            <nuxt-link :to="`/product/${data.id}`">{{ data.name }}</nuxt-link>
                          </div>
                          <div class="price_wrap">
                            <div class="cost-price" v-if="data.abroad_price">
                              <span>직접 구매가</span><template v-if="data.abroad_price.price > 0">{{ data.abroad_price.price | comma }}원</template>
                              <template v-else>-</template>
                            </div>
                            <div class="sale-price" v-if="!data.display_only"><span>몰리 판매가</span><em>{{ data.price | comma }}</em>원</div>
                          </div>
                          <div class="reaction">
                            <div class="data_star" v-if="data.total_score > 0 && (data.total_review_count + data.abroad_total_review_count) > 0">
                              <div class="only_star"></div>
                              <em>{{ (data.total_score / (data.total_review_count + data.abroad_total_review_count)) | ceil(1) }}</em>
                            </div>
                            <div class="data_star" v-else>
                              <div class="only_star disabled"></div>
                              <em>0</em>
                            </div>
                            <div class="data"><em>{{ data.total_sale_count | kUnit | comma }}</em>개 판매</div>
                            <div class="data">
                              <nuxt-link :to="`/product/${data.id}`"><em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰</nuxt-link>
                            </div>
                          </div>
                        </div>
                      </v-container>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- 가격비교 페이지네이션 START -->
              <div class="pagenation_wrap">
                <Pagenation
                  :total-count="groupProductTotalCount"
                  :page-size="groupProductPageSize"
                  :default-page="defaultPage"
                  :update-query="false"
                  :onPage="onPage"
                />
              </div>
              <!-- 가격비교 페이지네이션 END -->

            </div>
          </div>
          <!-- // 가격비교 상품 -->

          <!-- 상품 구매리뷰 -->
          <other-store-product-review class="d_ib w_100"  id="nav_review" :product="this.product" :group-id="productPriceGroup.id"/>
          <!-- // 상품 구매리뷰 -->

          <!-- 상품상세 -->
          <div class="product_show_content" id="nav_detail" v-if="product.content">
            <div class="product_content_inside m_t_40">
              <div class="product_details">
                <SummernoteEditor :preview="true" summernoteId="productDetail" :detailContent="product.content" :detailImageArr="product.detail_images" />
              </div>
              <div class="but_wrap" id="openProductDetailButton">
                <a class="gray_line_but" @click="openProductDetail">펼치기</a>
              </div>
            </div>
          </div>
          <!-- // 상품상세 -->
        </div>

      </div>
    </v-container>

    <Footer></Footer>
    <Dockbar></Dockbar>
  </div>
</template>

<script src="@/assets/javascripts/price_group/_id/index.js"></script>
