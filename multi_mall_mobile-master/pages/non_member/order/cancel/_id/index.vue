<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="mypage_info_wrap">
        <div class="main_title_wrap">
          <h2>비회원 주문 조회</h2>
        </div>
        <div class="top_nav_bar">
          <TopTabNav></TopTabNav>
        </div>
        <div>
          <div class="order_list_wrap">
            <div class="info_top">
              <div class="order_info_txt">
                <span><em>일시:</em> {{ $moment(orderProduct.ordered_at).format('YYYY년MM월DD일 HH시mm분') }}</span>
                <span><em>주문번호:</em> {{ orderProduct.order_num }}</span>
              </div>
              <div class="store_info_txt">
                <div class="pull-left">
                  Store: <nuxt-link class="info_txt" :to="`/store/${orderProduct.store_id}`">{{ orderProduct.store_name_kor }}</nuxt-link>
                </div>
              </div>
            </div>
            <div class="order_list">
              <ul>
                <!-- 배송중 -->
                <li>
                  <div class="order_inner">
                    <div class="order_img">
                      <DefaultImage :imageUrl="orderProduct.product_image"/>
                    </div>
                    <div class="order_info">
                      <div class="date_wrap">
                        <div class="info_title">
                          <nuxt-link :to="`/product/${orderProduct.product_id}`">{{ orderProduct.product_name }}</nuxt-link>
                        </div>
<!--                        todo: 옵션 글자 css -->
                        <div v-if="orderProduct.product_option_names">
                          <template v-for="(optionName, optionIdx) in orderProduct.product_option_names.split('/')">
                            <template v-if="optionName.split(':').length >= 2">
                              <b :key="`option_${optionName}`">{{ optionName.split(':')[0] }} :</b> {{ optionName.split(':')[1] }}
                            </template>
                            <b :key="`divided_${optionIdx}`" v-if="optionIdx < orderProduct.product_option_names.split('/').length - 1">/ </b>
                          </template>
                          <span v-if="orderProduct.option_price && orderProduct.option_price > 0">(+{{ orderProduct.option_price | comma }}원)</span>
                        </div>

                        <span class="info_txt">{{ orderProduct.order_status_str }}</span>
                        <br/>
                        <span class="upfront pull-right">
                          상품가격: {{ orderProduct.product_price | comma }}원({{ orderProduct.amount }}개)
                        </span><br/>
                        <span class="upfront pull-right">할인적용가: - {{ orderProduct.product_discount_price || orderProduct.product_discount_price > 0 ? (orderProduct.product_price - orderProduct.product_discount_price) * orderProduct.amount : 0 | comma }}원</span><br/>
                        <span class="upfront pull-right">
                          배송비: {{ orderProduct.delivery_fee | comma }}원 ({{ orderProduct.fee_pay_method_str }})
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
<!--            <div class="total_price_wrap_clearfix">-->
<!--              <span class="price_name">상품 가격</span>-->
<!--              <p class="price brand_color">{{ orderProduct.product_price | comma }}원({{ orderProduct.amount }}개)</p>-->
<!--            </div>-->
          </div>
          <div class="order_info_wrap">
            <div class="order_info_group">
              <div class="info_title">취소 사유
                <div class="square_but_wrap pull-right" v-if="orderProduct.order_status !== 'NOT_PAID'">
                  <a class="line_but" v-on:click="popTerms('rtrn', '환불 약관 고지')">환불 약관 고지</a>
                </div>
              </div>
              <ul>
                <li>
                  <div class="info_txt">사유</div>
                  <div class="select_wrap">
                    <select v-model="order_product_cancel.reason_sub_type">
                      <option value="">선택</option>
                      <option v-for="type in reasonSubTypeCodes" :key="type.value.code" :value="type.value.code">{{ type.value.name }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="info_txt">내용</div>
                  <div class="content_info">
                    <textarea placeholder="내용을 입력해주세요." v-model="order_product_cancel.reason"></textarea>
                  </div>
                </li>
              </ul>
            </div>
            <div class="order_info_group" v-if="orderProduct.order_status !== 'NOT_PAID'">
              <div class="info_title">환불 정보</div>
              <ul>
                <li>
                  <div class="status_name">상품 취소 금액</div>
                  <div class="status_info"><span>{{ cancelProductPrice | comma }}원</span></div>
                </li>
                <li>
                  <div class="status_name">배송비</div>
                  <div class="status_info"><span>{{ cancelDeliveryPrice | comma }}원</span></div>
                </li>
                <li>
                  <div class="status_name">결제정보</div>
                  <div class="status_info">
                    <span>{{ orderProduct.payment_method_str }}</span><br/>
                    <span class="font_12">({{ orderProduct.paid_at | date }})</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="total_price_wrap_clearfix">
              <span class="price_name">총 환불(예정) 금액</span>
              <p class="price brand_color">{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</p>
            </div>
          </div>
        </div>
        <div class="but_wrap">
          <nuxt-link class="line_but" to="/non_member/order">취소</nuxt-link>
          <a v-on:click="requestCancel">취소 요청</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/non_member/order/cancel/_id/index.js"></script>
