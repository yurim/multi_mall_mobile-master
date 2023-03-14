<template>
  <div>

    <!-- 셀퍼 상품 타입 태그 Start -->
    <selper style="display:none;" class="__selperProductType" eventtype="ViewContent" desc="셀퍼상품타입태그" :platform="selperPlatform" ostype="mobile">
      <selper :class="`__selperProductItemProductType${index + 1}`" :desc="`상품카테고리${index + 1}`"
              v-for="(category, index) in product.category_list" :key="category._id">{{ category.name}}</selper>
    </selper>
    <!-- 셀퍼 상품 타입 태그 End -->
    <!-- 셀퍼 상품 상세 태그 Start -->
    <selper style="display:none;" class="__selperProductItem" eventtype="ViewContent" desc="셀퍼상품상세태그" :platform="selperPlatform" ostype="mobile">
      <selper class="__selperProductItemId"         desc="상품아이디">{{ product.id }}</selper>
      <selper class="__selperProductItemBasePrice"         desc="상품가격">{{ product.price }}</selper>
      <selper class="__selperProductItemSalePrice"         desc="상품판매가격">{{ product.discount_price ? product.discount_price : product.price }}</selper>
      <selper class="__selperProductItemShippingPrice"     desc="배송비">{{ product.delivery_info.default_fee }}</selper>
      <selper class="__selperProductItemCurrency"         desc="통화">KRW</selper>
      <selper class="__selperProductItemName"         desc="상품이름">{{ product.name }}</selper>
      <selper class="__selperProductItemAvailability"         desc="재고">I</selper>
      <selper class="__selperProductItemAvailableQuantity"     desc="상품재고수량">0</selper>
      <selper class="__selperProductItemQuantity"         desc="상품수량">1</selper>
      <selper class="__selperProductItemDescription"     desc="상품설명">{{ product.content }}</selper>
      <selper class="__selperProductItemBrand"         desc="브랜드명">{{ product.store_name_kor }}</selper>
      <selper class="__selperProductItemImageUrl"         desc="상품이미지">{{ product.main_image }}</selper>
      <selper class="__selperProductItemOption"         desc="상품옵션">
        <template v-for="(option, index) in product.options">{{ option.name }}{{ index < product.options.length - 1 ? ',' : null}}</template>
      </selper>
      <selper class="__selperProductItemEnc"         desc="">{{ (userId && userGrade === 0) ? userId : null }}</selper>
    </selper>
    <!-- 셀퍼 상품 상세 태그 End -->

    <Header></Header>
    <v-container>
      <div>
        <!-- *** 카테고리 path START *** -->
        <div class="path">
          <ul>
            <template v-for="(category, index) in product.category_list">
              <li>
                <span>{{ category.name }}</span>
              </li>
            </template>
          </ul>
        </div>
        <!-- *** 카테고리 path END *** -->

        <!-- *** 상품 이미지 슬라이드 START *** -->
        <div class="swiper-container slide_vis">
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
      </div>

      <div class="product_show_wrap">
        <div>
          <!-- *** 상품상세정보 START *** -->
          <div class="text_wrap m_b_20">
            <div class="store_wrap">
                <span>{{ product.store_name_kor }}</span>
                <div class="btn_s_right">
                  <nuxt-link :to="`/store/${product.store_id}`" class="line_but">브랜드홈</nuxt-link>
                </div>
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
                <scrollactive class="my_nav" :modify-url="false">
                  <a href="#nav_review" class="scrollactive-item" @click="productReviewOn = true">
                    <em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰
                  </a>
                </scrollactive>
              </div>
            </div>
              <div class="price_wrap flex">
                <div class="cost-price">
                  <div class="font_14 font_nomal">{{ product.store_name_kor }} 판매가</div>
                  <template v-if="product.abroad_price && product.abroad_price.price > 0">
                    {{ product.abroad_price.price | comma }}원
                  </template>
                  <template v-else>
                    -
                  </template>
                </div>
                <template v-if="product.is_sale && !product.display_only">
                  <div class="sale-price"><div class="font_14 font_nomal">몰리판매가</div><b><em class="brand_color">{{ product.discount_price ? product.discount_price : product.price | comma }}</em>원</b></div>
                  <div class="guide_txt" v-if="product.is_abroad">몰리판매가 : 판매원가 + 최대 50%(상품 하자 및 반품책임수수료) + 무게에 따른 배송비를 포함한 금액입니다.</div>
                </template>
              </div>
            <div class="etc_info" v-if="product.is_sale && !product.display_only">
              <div class="clfix">
                <dt>배송비</dt>
                <dd v-if="product.delivery_info && (product.delivery_info.default_fee > 0)">
                  {{ product.delivery_info.default_fee | comma }}원
                  <span>{{ (product.delivery_info) ? product.delivery_info.fee_pay_method_str : '' }}</span>
                </dd>
                <dd v-else><b>무료</b></dd>
              </div>
              <div class="clfix">
                <dt>적립금</dt>
                <dd v-if="product.discount_price">
                  {{ Math.floor(product.discount_price * product.saving_rate / 100) | comma }} point ({{ product.saving_rate }}%적립)
                </dd>
                <dd v-else>
                  {{ Math.floor(product.price * product.saving_rate / 100) | comma }} point ({{ product.saving_rate }}%적립)
                </dd>
              </div>
              <div class="clfix">
                <p>*조건에 따라 추가비용 발생 가능(상품상세 정보 참고)</p>
              </div>
            </div>
          </div>
          <!-- *** 상품상세정보 END *** -->

          <!-- *** 가격비교 버튼 start *** -->
          <div class="price_compare_btn_wrap m_b_10" v-if="product.product_price_group_id">
            <nuxt-link :to="`/price_group/${product.id}`" class="price_compare">비슷한 상품 가격 비교하기!</nuxt-link>
          </div>
          <!-- *** 가격비교 버튼 End *** -->

          <div class="option-wrap_open">
          </div>
        </div>
        <!-- 탭메뉴 START -->
        <div class="product_tab_nav" id="stickyNav">
          <div>
            <scrollactive class="my_nav" :modify-url="false" :offset="121" active-class="on">
              <a href="#nav_review" class="scrollactive-item" @click="productReviewOn = true">상품리뷰<span>({{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }})</span></a>
              <a href="#nav_detail" class="scrollactive-item">상품상세</a>
              <a href="#nav_exchange" class="scrollactive-item" @click="exchangeReturnNoticeOn = true">반품/교환정보</a>
              <a href="#nav_question" class="scrollactive-item" @click="productQuestionOn = true">상품문의<span>({{ fixedQuestionTotalCount | comma }})</span></a>
            </scrollactive>
          </div>
        </div>
        <!-- 탭메뉴 END -->

        <div class="product-info-wrap">
          <!--  상품리뷰-->
          <div id="nav_review" class="renewal_view_box_bottom" :class="{on: productReviewOn}">
            <div class="view_inner" @click="productReviewOn = !productReviewOn">
              <a>
                <h4>상품리뷰 <span>{{ (product.total_review_count + product.abroad_total_review_count) | comma }}</span></h4>
                <span class="btn_toggle"></span>
              </a>
            </div>
            <div class="info_content">
              <!-- 상품리뷰 START -->
              <product-review :product="this.product"/>
              <!-- 상품리뷰 END -->
            </div>
          </div>
          <!--  // 상품리뷰-->

          <!--     상품정보-->
          <div class="product_show_content">
            <div class="product_content_inside">
              <!--     해외상품정보고시 (상단)--->
              <div v-if="product.is_show_abroad_template && product.ntc_list.ABRD_PRDCT_TOP_NTC">
                <div>
                  <SummernoteEditor :preview="true" summernoteId="templateAPTN" :detailContent="product.ntc_list.ABRD_PRDCT_TOP_NTC.content"
                                    :detailImageArr="product.ntc_list.ABRD_PRDCT_TOP_NTC.images" />
                </div>
              </div>
              <!--  // 해외상품정보고시 (상단)--->

              <!-- 상품 상세 START -->
              <div id="nav_detail" class="product_details">
                <SummernoteEditor :preview="true" summernoteId="productDetail" :detailContent="product.content" :detailImageArr="product.detail_images" />
                <!--  <p><img src="@/assets/img/product_default_img.png" alt="제품이미지"></p>-->
                <!--  <p><img src="@/assets/img/product_default_img.png" alt="제품이미지"></p>-->
              </div>
              <!-- 상품 상세 END -->

              <!--     해외상품정보고시 (하단)--->
              <div v-if="product.is_show_abroad_template && product.ntc_list.ABRD_PRDCT_BTM_NTC">
                <div>
                  <SummernoteEditor :preview="true" summernoteId="templateAPBN" :detailContent="product.ntc_list.ABRD_PRDCT_BTM_NTC.content"
                                    :detailImageArr="product.ntc_list.ABRD_PRDCT_BTM_NTC.images" />
                </div>
              </div>
              <!--  // 해외상품정보고시 (하단)-->

              <!--     상품정보고시-->
              <div v-if="product.ntc_list && product.ntc_list.PRDCT_NTC">
                <div>
                  <SummernoteEditor :preview="true" summernoteId="templatePN" :detailContent="product.ntc_list.PRDCT_NTC.content"
                                    :detailImageArr="product.ntc_list.PRDCT_NTC.images" />
                </div>
              </div>
              <!--  // 상품정보고시-->

              <!--  배송정보 고시-->
              <div v-if="product.ntc_list && product.ntc_list.DLVRY_NTC">
                <div>
                  <SummernoteEditor :preview="true" summernoteId="templateDN" :detailContent="product.ntc_list.DLVRY_NTC.content"
                                    :detailImageArr="product.ntc_list.DLVRY_NTC.images" />
                </div>
              </div>
              <!--  //배송정보 고시-->

              <div class="but_wrap" id="openProductDetailButton">
                <a class="gray_line_but" @click="openProductDetail">펼치기</a>
              </div>
            </div>
          </div>
          <!--  // 상품정보-->

          <!--  반품/교환정보-->
          <div id="nav_exchange" class="renewal_view_box_bottom" :class="{on: exchangeReturnNoticeOn}" v-if="product.ntc_list && product.ntc_list.EXCHNG_RTND">
            <div class="view_inner" @click="exchangeReturnNoticeOn = !exchangeReturnNoticeOn">
              <a>
                <h4>반품/교환정보</h4>
                <span class="btn_toggle"></span>
              </a>
            </div>
            <div class="info_content">
              <SummernoteEditor :preview="true" summernoteId="templateER" :detailContent="product.ntc_list.EXCHNG_RTND.content"
                                :detailImageArr="product.ntc_list.EXCHNG_RTND.images" />
            </div>
          </div>
          <!--  반품/교환정보-->
          <!--   상품문의-->
          <div id="nav_question" class="renewal_view_box_bottom" :class="{on: productQuestionOn}">
            <div class="view_inner" @click="productQuestionOn = !productQuestionOn">
              <a>
                <h4>상품문의 <span>{{ questionTotalCount }}</span></h4>
                <span class="btn_toggle"></span>
              </a>
            </div>
            <div class="info_content">
              <!-- *** 상품문의 START *** -->
              <product-question/>
              <!-- *** 상품문의 END *** -->
            </div>
          </div>
          <!--  // 상품문의-->
        </div>
      </div>

      <!-- *** 상품 옵션선택/구매 START *** -->
      <div class="mobile_dockbar">
        <div class="product_button">
          <div class="product_btn_wrap icon_two" v-if="product.is_sale && !product.display_only">
            <a @click="onByeWrap = !onByeWrap" class="cart"></a>
            <template v-if="sale_type === '011'"><!-- 몰리판매불가 x, 해외상품여부 o, 링크있음 o -->
              <a :href="product.detail_url" target="_blank" class="line_but">
                <template v-if="product.abroad_price && product.abroad_price.price > 0">
                 <b> {{ product.abroad_price.price | comma }} 원</b>
                  <div class="font_12">{{ product.store_name_kor }} 결제</div>
                </template>
                <template v-else>
                  -
                </template>
              </a>
              <a @click="onByeWrap = !onByeWrap">
                <b>{{ product.discount_price ? product.discount_price : product.price | comma }} 원</b>
                <div class="font_12">몰리 결제</div>
              </a>
            </template>
            <template v-else-if="sale_type === '010'"><!-- 몰리판매불가 x, 해외상품여부 o, 링크있음 x -->
              <a @click="onByeWrap = !onByeWrap">{{ product.discount_price ? product.discount_price : product.price | comma }}원 몰리에서 결제하기</a>
            </template>
            <template v-else-if="sale_type === '000'"><!-- 몰리판매불가 x, 해외상품여부 x, 링크있음 x -->
              <a @click="onByeWrap = !onByeWrap">{{ product.discount_price ? product.discount_price : product.price | comma }}원 몰리에서 결제하기</a>
            </template>
            <template v-else-if="sale_type === '001'"><!-- 몰리판매불가 x, 해외상품여부 x, 링크있음 o -->
              <a :href="product.detail_url" target="_blank" class="line_but">
                <b v-if="product.abroad_price && product.abroad_price.price > 0"> {{ product.abroad_price.price | comma }} 원</b>
                <div class="font_12">{{ product.store_name_kor }} 결제</div>
              </a>
              <a @click="onByeWrap = !onByeWrap">
                <b>{{ product.discount_price ? product.discount_price : product.price | comma }} 원</b>
                <div class="font_12">몰리 결제</div>
              </a>
            </template>
          </div>
          <div class="product_btn_wrap" v-else>
            <a :href="product.detail_url" target="_blank" v-if="sale_type === '101' || sale_type === '001'" class=""><!-- 몰리판매불가 o|x, 해외상품여부 x, 링크있음 o -->
              <template v-if="product.abroad_price && product.abroad_price.price > 0">
                <span><b>{{ product.abroad_price.price | comma }}</b> 원에 구매하러가기</span>
                <div class="guide_txt white">옵션에 따라 금액이 바뀔 수 있습니다.</div>
              </template>
              <template v-else>
                -
                <div class="guide_txt white">옵션에 따라 금액이 바뀔 수 있습니다.</div>
              </template>
            </a>
            <a :href="product.detail_url" target="_blank" v-else-if="sale_type === '111' || sale_type === '011'" class=""><!-- 몰리판매불가 o|x, 해외상품여부 o, 링크있음 o -->
              <template v-if="product.abroad_price && product.abroad_price.price > 0">
                <span><b>{{ product.abroad_price.price | comma }}</b> 원에 직구하기</span>
                <div class="guide_txt white">옵션에 따라 금액이 바뀔 수 있습니다.</div>
              </template>
              <template v-else>
                -
                <div class="guide_txt white">옵션에 따라 금액이 바뀔 수 있습니다.</div>
              </template>
            </a>
            <a v-else class="disabled_but">판매중지된 상품입니다.</a>
          </div>
        </div>

        <!-- *** 옵션 선택 구매창 START *** -->
        <div class="price_buy_wrap" :class="{ 'on': onByeWrap }">
          <div class="buy_close">
            <a @click="onByeWrap = false"></a>
          </div>
          <div class="select_zone">
            <!-- *** 옵션선택 START *** -->
            <div class="v-select_wrap">
              <template v-for="(productOption, index) in options">
                <vue-select :options="productOption.option_values" :placeholder="`${productOption.name} 선택`"
                            label="value" :searchable="false" v-model="selectedOptionValues[index]" @input="changeOption(index)" :clearable="false">
                  <!-- 옵션 리스트 -->
                  <template v-slot:option="option">
                    <div @mouseenter="product.use_option_image && option.image ? showOptionPreview(option) : ''" class="option_list_wrap">
                      <div class="img_wrap">
                        <DefaultImage :imageUrl="option.image" v-if="product.use_option_image && option.image"/>
                      </div>
                      <span>{{ option.value }}</span>
                      <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                        <span>({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)</span>
                      </template>
                      {{ (option.isSoldOut) ? '[품절]' : '' }}
                    </div>
                  </template>
                  <!-- 옵션이 없는 경우 -->
                  <div slot="no-options">상위 옵션을 선택해주세요.</div>
                  <!-- 선택된 옵션 보여지는 부분 -->
                  <template #selected-option-container="{ option }">
                    <div class="vs__selected">
                      {{ option.value }}
                      <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                        ({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)
                      </template>
                    </div>
                  </template>
                </vue-select>
              </template>
            </div>
            <!-- *** 옵션선택 END *** -->

            <!-- *** 선택된 옵션 START *** -->
            <div class="price_info_wrap">
              <div class="price_info" v-for="(selectedItem, index) in selectedOptionCompositions">
                <div class="option_del">
                  <div class="option_name">
                    {{ selectedItem.value }}
                    <template v-if="selectedItem.additional_price && selectedItem.additional_price > 0">
                      (+{{ selectedItem.additional_price | comma }}원)
                    </template>
                  </div>
                  <a @click="delSelectedOption(index)"></a>
                </div>
                <div class="total_price_wrap">
                  <div class="product-count">
                    <a class="minus_but" @click="decAmount" :index="index"></a>
                    <input type="number" class="count_box" :value="selectedItem.amount" :index="index"
                           @change="changeOptionAmount">
                    <a class="plus_but" @click="incAmount" :index="index"></a>
                  </div>
                </div>
                <div class="selected-price">
                  <p class="price">{{ selectedItem.price * selectedItem.amount | comma }}<span>원</span></p>
                </div>
              </div>
            </div>
            <!-- *** 선택된 옵션 END *** -->

            <!-- *** 총 금액 START *** -->
            <div class="total_price_wrap_clearfix">
              <span class="price_name">총 결제 금액</span>
              <p class="price brand_color">{{ selectedTotalPrice | comma }}원 ({{ selectedTotalAmount | comma }}개)</p>
            </div>

            <div id="naverPayWrap" style="float: right; margin-top: 10px;" onclick="return false;"></div>
            <!-- *** 총 금액 END *** -->
          </div>

          <!-- *** 구매버튼 START *** -->
          <div class="but_wrap" v-if="product.is_sale && !product.display_only">
            <a class="line_but" @click="addCarts">장바구니</a>
            <a @click="buy">구매하기</a>
          </div>
          <div class="but_wrap" v-else>
            <a class="disabled_but">판매중지된 상품입니다.</a>
          </div>
          <!-- *** 구매버튼 END *** -->
        </div>
        <!-- *** 옵션 선택 구매창 END *** -->
      </div>
      <!-- *** 상품 옵션선택/구매 END *** -->

    </v-container>
      <Dockbar></Dockbar>
  </div>
</template>

<script src="@/assets/javascripts/product/_id/index.js"></script>
