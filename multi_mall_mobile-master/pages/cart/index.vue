<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap m_t_40">
          <span>장바구니</span>
          <span class="order_step_list_wrap "><span class="color_black">장바구니</span> > 주문/결제 > 주문완료</span>
        </div>
      </div>

      <div class="m_t_10 d_ib_100">
        <div class="checkbox_wrap m_b_10">
          <input type="checkbox" id="test_cheak"
                 @click="checkAll"
                 :checked="storeGroupList.flat(Infinity).filter((v) => v.isChecked).length === storeGroupList.flat(Infinity).length">
          <label for="test_cheak">전체선택</label>
        </div>
        <div class="w_auto pull-right square_but_wrap d_ib m_l_20">
          <a class="gray_but_light" @click="deleteAllCarts">전체삭제</a>
          <a class="gray_but_light" @click="deleteSelectedCarts">선택삭제</a>
        </div>
      </div>
      <div class="m_t_20">
        <!-- ul 1개 = 스토어 1개-->
        <template v-if="storeGroupList.length > 0">
        <ul class="product_cart_list_wrap" v-for="storeGroup in storeGroupList">
          <li>
            <div class="brand_name_wrap">
              <span>Store : </span><span class="color_main_01 f_bold">{{ getFirstObject(storeGroup).store.name_kor }}</span>
              <a :href="`/store/${getFirstObject(storeGroup).store.id}`">브랜드 홈가기</a>
            </div>

            <div class="item_list_wrap" v-for="deliveryGroup in storeGroup">
              <div class="product_cart_list_wrap__product_wrap" v-for="productGroup in deliveryGroup">
                <div class="checkbox_wrap">
                  <input
                    type="checkbox"
                    :id="`check_${getFirstObject(productGroup).product_id}`"
                    @click="toggleChecked(productGroup)"
                    :disabled="!getFirstObject(productGroup).product_info.is_sale
                         || !getFirstObject(productGroup).product_info.is_listed
                         || getFirstObject(productGroup).product_info.is_blocked"
                    :checked="getFirstObject(productGroup).isChecked">
                  <label :for="`check_${getFirstObject(productGroup).product_id}`"></label>
                </div>

                <div class="product_cart_list_wrap__right_wrap">
                  <div class="product_cart_list_wrap__right_wrap__img">
                    <img v-if="getFirstObject(productGroup).product_info.main_image" :src="getFirstObject(productGroup).product_info.main_image" alt="제품이미지">
                    <img v-else alt="기본이미지" src="@/assets/img/product_default_img.png">
                  </div>
                  <div class="product_cart_list_wrap__right_wrap__title">
                    <div class="title_wrap">
                      <span v-if="!getFirstObject(productGroup).product_info.is_sale
                         || !getFirstObject(productGroup).product_info.is_listed
                         || getFirstObject(productGroup).product_info.is_blocked" class="color_r">
                          [판매중지]
                        </span>
                      <a @click="moveProductDetail(getFirstObject(productGroup))">{{getFirstObject(productGroup).product_info.name}}</a>
                    </div>
                    <div class="info_price">
                      <span>판매원가</span>
                      <span class="fs_normal">{{ getFirstObject(productGroup).product_info.price | comma }}원</span>
                        <span><b class="color_main_01">-{{ (1 - (getFirstObject(productGroup).product_info.discount_price / getFirstObject(productGroup).product_info.price)) * 100 | rate }}</b>% 적용</span>
                    </div>
                  </div>
                  <div class="product_cart_list_wrap__right_wrap__icon">
                    <a @click="deleteCart(productGroup)"></a>
                  </div>
                </div>

                <div class="d_ib_100">
                  <ul class="product_cart_list_wrap__price_wrap">
                    <!-- 옵션 1개당 li 1개 -->
                    <li v-for="cart in productGroup">
                      <div class="product_cart_list_wrap__price_wrap__title" v-if="cart.option_info">
                        <div class="order_cart_list">
                          <div class="option">선택 옵션</div>
                          <span class="order_info color_r" v-if="isOutOfStock(getFirstObject(cart))">[품절]</span>
                          <span class="order_info" :class="{ 'text-readonly' : isOutOfStock(getFirstObject(cart)) }">{{cart.option_info.option_str_list.join(' / ')}}</span>
                          <div class="order_cart_list_icon">
                            <a @click="deleteCart(cart)"></a>
                          </div>
                        </div>
                      </div>
                      <div class="product_cart_list_wrap__price_wrap__title" v-else></div>
                      <div v-if="cart.option_info.additional_price === 0"><em>옵션 추가금액</em> 없음</div>
                      <div v-else><em>옵션 추가금액</em> {{cart.option_info.additional_price | comma}}<em>원</em></div>
                      <div class="info_bottom">
                        <div><em>할인적용가</em> <b class="brand_color">{{ getProductPrice(getFirstObject(cart)) | comma}}</b>원</div>
                        <div class="price_wrap__number">
                          <em>수량</em>
                          <div class="product-count">
                            <a class="minus_but" @click="updateAmount(cart, -1)"></a>
                            <input type="text" class="count-textbox" v-model="cart.amount" readonly>
                            <a class="plus_but" @click="updateAmount(cart, 1)"></a>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>

              <div class="store_total_price_wrap d_ib_100">
                <div>
                  <div class="store_total_price_wrap__delivery_fee"><em>배송비</em>
                    <template v-if="getFirstObject(deliveryGroup).deliveryPrice > 0">
                      {{ getFirstObject(deliveryGroup).deliveryPrice | comma }}원
                      {{ getFirstObject(deliveryGroup).delivery_info.fee_pay_method === 'CSH_DLVRY' ? '(착불)' : '' }}
                    </template>
                    <template v-else>무료배송</template>
                  </div>
                  <div class="store_total_price_wrap__total_price"><em>결제 예정금액</em>
                    <b><span class="color_main_01">{{ getFirstObject(deliveryGroup).totalPrice | comma }}</span>원</b></div>
                </div>
              </div>
            </div>

          </li>
        </ul>
        </template>

        <!-- 장바구니 비었을때 -->
        <template v-else>
          <div class="product_cart_empty">
            <div class="cart_empty_content">
              <i class="cart_icon"></i>
              <p>장바구니에 담긴 상품이 없습니다.</p>
              <div class="but_wrap">
                <nuxt-link class="gray_line_but" to="/main">계속 쇼핑하기</nuxt-link>
              </div>
            </div>
          </div>
        </template>

      </div>
      <div class="payment_wrap">
        <ul class="order_total_list">
          <li class="title m_b_10">최종 결제 금액</li>
          <li>
            <div class="cart_table_wrap">
              <table class="none_border m_b_0">
                <colgroup>
                  <col width="135">
                </colgroup>
                <tbody>
                <tr>
                  <th>판매원가</th>
                  <td class="text-right"><em class="brand_color">{{ totalPriceInfo.productPrice | comma }}</em>원</td>
                </tr>
                <tr>
                  <th>배송비</th>
                  <td class="text-right">{{ totalPriceInfo.deliveryPrice | comma }}원</td>
                </tr>
                <tr>
                  <th>할인금액</th>
                  <td class="text-right"><em class="color_pink">- {{ totalPriceInfo.salePrice | comma }}</em>원</td>
                </tr>
                <tr class="color_gray_7">
                  <th colspan="font_nomal">포인트 할인</th>
                  <td class="text-right" v-if="totalPriceInfo.pointSalePrice > 0"><em class="color_pink">- {{ totalPriceInfo.pointSalePrice | comma }}</em>원</td>
                  <td class="text-right" v-else><em class="color_pink">- 0</em>원</td>
                </tr>
                <!-- TODO 쿠폰할인은 2,3차 개발-->
<!--                <tr class="color_gray_7">-->
<!--                  <th colspan="font_nomal">쿠폰 할인</th>-->
<!--                  <td class="text-right">- {{ totalPriceInfo.couponSalePrice | comma }}원</td>-->
<!--                </tr>-->
                </tbody>
                <tfoot>
                <tr>
                  <th>총 결제 예정금액</th>
                  <td class="text-right">
                    <span class="price_sale_total">{{ totalPriceInfo.totalPrice | comma }}원 ({{ totalPriceInfo.totalQuantity | comma }}개)</span>
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>
          </li>
        </ul>
      </div>

      <div class="mobile_dockbar">
        <!-- *** 장바구니페이지 구매 버튼 START *** -->
          <div class="cart_but_wrap">
            <div id="naverPayWrap" class="naver_pay" onclick="return false;"></div>
            <div class="total_price_wrap">
              <div class="total_price">합계: <em class="brand_color">{{ totalPriceInfo.totalPrice | comma }}원</em></div>
              <a @click="selectedCartsBuy">구매하기 ({{ totalPriceInfo.totalQuantity | comma }}개)</a>
            </div>
          </div>
        <!-- *** 장바구니페이지 구매 버튼 END *** -->
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/cart/index.js"></script>
