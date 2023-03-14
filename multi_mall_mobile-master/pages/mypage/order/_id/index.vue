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
          <div class="order_list_wrap m_t_20">
            <div class="order_list" v-if="order.stores.length > 0">
              <template v-for="(store, storesIdx) in order.stores">
                <div class="store_info_txt">
                  <div class="pull-left">Store: <nuxt-link class="info_txt" :to="`/store/${store.store_id}`">{{ store.store_name_kor }}</nuxt-link></div>
                  <div class="square_but_wrap pull-right font_nomal">
                    <a :href="order.receipt_url" target="_blank" class="gray_but_light">영수증 출력</a>
                  </div>
                </div>
                <div class="info_top">
                  <div class="order_info_txt">
                    <ul class="Payment_list_status">
                      <li>
                        <span><em>{{ $moment(order.ordered_at).format('YYYY-MM-DD / HH:mm') }}</em></span>
                      </li>
                      <li>
                        <span><em class="p_r_5">주문번호:</em> {{ order.order_num }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <ul class="info_bottom">
                  <template v-for="(group, deliveryGroupsIdx) in store.delivery_groups">
                    <li v-for="(product, prdIdx) in group.order_products" :key="`groupProducts_${product.id}`">
                      <div class="order_list_box">
                        <div class="order_inner">
                          <div class="order_img">
                            <DefaultImage :imageUrl="product.product_image"/>
                          </div>
                          <div class="order_info">
                            <div class="date_wrap">
                              <div class="info_title">
                                <nuxt-link :to="`/product/${product.product_id}`">{{ product.product_name }}</nuxt-link>
                              </div>
                              <div v-if="product.product_option_names">
                                <template v-for="(optionName, optionIdx) in product.product_option_names.split('/')">
                                  <template v-if="optionName.split(':').length >= 2">
                                    <b :key="`option_${optionName}`">{{ optionName.split(':')[0] }} :</b> {{ optionName.split(':')[1] }}
                                  </template>
                                  <b :key="`divided_${optionIdx}`" v-if="optionIdx < product.product_option_names.split('/').length - 1">/ </b>
                                </template>
                                <span v-if="product.option_price && product.option_price > 0">(+{{ product.option_price | comma }}원)</span>
                              </div>

                            </div>
                          </div>
                          <div class="order_info_cont">
                            <div>
                              배송비
                              <div>
                                <span v-if="prdIdx === 0">{{ group.delivery_fee | comma }}원({{group.fee_pay_method}})</span>
                                <span v-else>- </span>
                                <span v-if="group.order_products.length > 1">(묶음)</span>
                              </div>
                            </div>
                            <div>상품가격<span>{{ product.product_price | comma }}원({{ product.amount }}개)</span></div>
                            <div class="discount_txt">할인적용가<span>- {{ product.product_discount_price || product.product_discount_price > 0 ? (product.product_price - product.product_discount_price) : 0 | comma }}원</span></div>
                          </div>
                        </div>
                        <div class="payment_list_status">
                          <div class="info_txt">{{ product.order_status_str }}</div>
                          <div class="font_12"
                                v-if="product.order_sub_status
                             && ['CNCL', 'EXCHNG', 'RTRN'].indexOf(product.order_status) >= 0
                             || product.order_sub_status === 'DLY_DLVRY'">[{{ product.order_sub_status_str }}]</div>
                          <div v-if="product.claim_rejected">
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_CNCL'" class="font_12">[취소거부]</span>
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_EXCHNG'" class="font_12">[교환거부]</span>
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_RTRN'" class="font_12">[반품거부]</span>
                            </div>
                          <div class="square_but_wrap">
                            <a class="pink_disabled_but"
                               v-if="['RQST_CNCL', 'RQST_EXCHNG', 'RQST_RTRN', 'DLY_DLVRY'].indexOf(product.order_sub_status) >= 0"
                               v-on:click="showReason(product.id)">사유보기</a>
                            <a class="gray_but_light" v-if="['CNCL','EXCHNG', 'RTRN'].indexOf(product.order_status) >= 0 || product.claim_rejected"
                               v-on:click="showDetail(product)">상세보기</a>
                          </div>
                        </div>
                      </div>

                      <div class="square_but_wrap">
                        <a
                          class="gray_but_light"
                          v-if="product.order_status === 'DLVRNG'
                                  || product.order_status === 'DLVRY_CMPLT'
                                  || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                          v-on:click="popupDeliveryInquiry(product, store)"
                        >
                          배송조회
                        </a>
                        <nuxt-link
                          class="gray_but_light"
                          v-if="product.order_status === 'NOT_PAID' || product.order_status === 'DLVRY_WAIT'"
                          :to="`/mypage/order/cancel/${product.id}`"
                        >
                          주문취소
                        </nuxt-link>
                        <nuxt-link
                          class="gray_but_light"
                          v-if="product.order_status === 'DLVRNG'
                                  || product.order_status === 'DLVRY_CMPLT'
                                  || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                          :to="`/mypage/order/exchange/${product.id}`"
                        >
                          교환신청
                        </nuxt-link>
                        <nuxt-link
                          class="gray_line_light_red"
                          v-if="product.order_status === 'DLVRNG'
                                  || product.order_status === 'DLVRY_CMPLT'
                                  || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                          :to="`/mypage/order/return/${product.id}`"
                        >
                          반품신청
                        </nuxt-link>
                        <a
                          class="gray_but_light"
                          v-if="product.order_status === 'DLVRY_CMPLT'"
                          v-on:click="completePurchase(product)"
                        >
                          구매확정
                        </a>
                        <a
                          class="gray_but_light"
                          v-if="product.order_status === 'DCD_PRCHS' && !product.is_review_written"
                          v-on:click="popupReviewWrite(product)"
                        >
                          리뷰쓰기
                        </a>
                        <span
                          class="disabled disabled_line_but"
                          v-if="product.order_status === 'DCD_PRCHS' && product.is_review_written"
                        > 리뷰작성완료</span>
                        <a
                          class="gray_but_light"
                          v-if="(product.order_status === 'EXCHNG' && product.order_sub_status === 'RQST_EXCHNG')
                                  || (product.order_status === 'RTRN' && product.order_sub_status === 'RQST_RTRN')
                                  || (product.order_status === 'CNCL' && product.order_sub_status === 'RQST_CNCL')"
                          v-on:click="cancelRequestCancel(product.order_status, product.order_sub_status, product.id)"
                        >
                          요청취소
                        </a>
                        <a
                          class="gray_but_light"
                          v-on:click="popupInquiryProduct(product, store)"
                        >
                          상품문의
                        </a>
                      </div>
                    </li>
                  </template>
                </ul>
              </template>

            </div>
            <div class="total_price_wrap_clearfix">
              <span class="price_name">총 결제 금액</span>
              <p class="price">{{ order.paid_price | comma }} 원</p>
            </div>
          </div>

          <div class="order_info_wrap" v-if="order.order_delivery">
            <div class="order_info_group">
              <div class="info_title">배송지 정보</div>
              <ul>
                <li>
                  <div class="status_name">받는 사람</div>
                  <div class="status_info">{{ order.order_delivery.name }}</div>
                </li>
                <li>
                  <div class="status_name">전화번호</div>
                  <div class="status_info">{{ order.order_delivery.phone }}</div>
                </li>
                <li>
                  <div class="status_name">전화번호 2</div>
                  <div class="status_info"><div v-if="order.order_delivery.phone2">{{ order.order_delivery.phone2 }}</div></div>
                </li>
                <li>
                  <div class="status_name">배송지 주소</div>
                  <div class="status_info">[{{ order.order_delivery.zipcode }}] {{ order.order_delivery.address }} {{ order.order_delivery.detail_address }}</div>
                </li>
                <li>
                  <div class="status_name">배송 메모</div>
                  <div class="status_info"><div v-if="order.delivery_message">{{ order.delivery_message }}</div></div>
                </li>
                <li v-if="order.clearance_num">
                  <div class="status_name">개인통관고유부호</div>
                  <div class="status_info">{{ order.clearance_num }}</div>
                </li>
              </ul>
            </div>
            <div class="order_info_group">
              <div class="info_title">결제 방법</div>
              <ul>
                <li>
                  <div class="status_name">{{ order.payment_method_str }}</div>
                  <div class="status_info" v-if="order.payment_method === 'VBANK'">
                    {{ order.virtual_account_bank }}<br>
                    {{ order.virtual_account_name}}({{order.virtual_account_num}})<br>
                    <div v-if="!order.paid_at && order.expired_at">({{ $moment(order.expired_at).format('YYYY년MM월DD일 HH시mm분') }} 까지)</div>
                    <div v-else-if="order.paid_at">결제완료<br>({{ $moment(order.paid_at).format('YYYY년MM월DD일 HH시mm분') }})</div>
                  </div>
                  <div class="status_info" v-else>
                    결제완료<br>({{ $moment(order.paid_at).format('YYYY년MM월DD일 HH시mm분') }})
                  </div>
                </li>
              </ul>
            </div>
            <div class="order_info_group last">
              <div class="info_title">결제 정보</div>
              <ul>
                <li>
                  <div class="status_name">총 상품 금액</div>
                  <div class="status_info"><span><em class="brand_color">{{ totalProductPrice | comma }}</em>원</span></div>
                </li>
                <li>
                  <div class="status_name">배송비</div>
                  <div class="status_info"><span>{{ order.total_delivery_fee | comma }}원</span></div>
                </li>
                <li>
                  <div class="status_name">할인금액</div>
                  <div class="status_info"><span><em class="color_pink">- {{ totalProductDiscount | comma }}</em>원</span></div>
                </li>
                <li>
                  <div class="status_name">포인트 할인</div>
                  <div class="status_info"><span><em class="color_pink">- {{ point | comma }}</em>원</span></div>
                </li>
                <li>
                  <div class="status_name">쿠폰 할인</div>
                  <div class="status_info"><span><em class="color_pink">- {{ coupon | comma }}</em>원</span></div>
                </li>
              </ul>
            </div>
            <div class="total_price_wrap_clearfix">
              <span class="price_name">총 결제 금액</span>
              <p class="price"><b>{{ order.paid_price | comma }}원</b></p>
            </div>
          </div>
        </div>
        <div class="but_wrap">
          <a @click="$router.go(-1)" class="gray_line_but">뒤로가기</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/mypage/order/_id/index.js"></script>
