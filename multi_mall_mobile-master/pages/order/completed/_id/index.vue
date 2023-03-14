<template>
  <div class="userWrap">
    <Header></Header>
    <v-container v-if="order">

      <div>
        <div class="list_title_wrap border_b_dark m_t_40">
          <span>주문완료</span>
          <span class="sub_title">{{ isMember ? '회원주문' : '비회원주문' }}</span>
          <span class="order_step_list_wrap ">장바구니 > 주문/결제 > <span class="color_black">주문완료</span></span>
        </div>
      </div>

      <div class="col_wrap m_t_20">
        <div class="d_ib_100 order_complete_wrap m_b_40">
          <div class="m_b_10 order_complete_wrap__title_wrap">
            <b><span class="brand_color">주문이 완료</span>되었습니다. 감사합니다!</b>
          </div>
          <div class="m_b_40 d_ib_100">
            <div class="d_ib m_r_20"><b>{{ order.ordered_at | date }}</b></div>
            <div class="d_ib color_gray_7">{{ order.order_num }}</div>
          </div>
          <div class="but_wrap">
            <nuxt-link to="/main">계속 쇼핑하기</nuxt-link>
          </div>
        </div>

        <div class="order_wrap">
          <ul class="product_order_list_wrap">
            <li>
              <table>
                <colgroup>
                  <col width="100">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="2">수령자 정보</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>수령인</th>
                  <td>{{ order.order_delivery.name }}</td>
                </tr>
                <tr>
                  <th>전화번호</th>
                  <td>{{ order.order_delivery.phone | contact }}</td>
                </tr>
                <tr>
                  <th>전화번호2</th>
                  <td>{{ order.order_delivery.phone_2 | contact }}</td>
                </tr>
                <tr>
                  <th>배송지 주소</th>
                  <td>[{{ order.order_delivery.zipcode }}] 도로명주소 : {{ order.order_delivery.address }}</td>
                </tr>
                <tr>
                  <th>배송 메모</th>
                  <td>{{ order.delivery_message }}</td>
                </tr>
                <!-- 무통장입금일경우-->
                <tr v-if="order.order_payment.payment_method ==='VBANK'">
                  <th>입금계좌</th>
                  <td>
                    {{ order.order_payment.virtual_account_bank }} {{ order.order_payment.virtual_account_num }}
                    {{ order.order_payment.virtual_account_name }}
                  </td>
                </tr>
                <tr v-if="order.order_payment.payment_method ==='VBANK'">
                  <th>입금기한</th>
                  <td>
                    <template v-if="order.order_payment.expired_at">
                      {{ order.order_payment.expired_at | date }} 까지 입금처리가 안되면 자동취소가 됩니다.
                    </template>
                  </td>
                </tr>
                  <!-- 무통장입금 외 결제완료시-->
                <tr>
                  <th>결제수단</th>
                  <td>
                    {{ order.order_payment.payment_method_str }} {{ order.paid_at | date }}
                  </td>
                </tr>
                </tbody>
              </table>
            </li>
          </ul>

          <ul class="m_t_20">
            <li class="title">최종 결제 금액</li>
            <li>
              <div class="cart_table_wrap ">
                <table class="none_border">
                  <colgroup>
                    <col width="100">
                    <col>
                  </colgroup>
                  <tbody>
                  <tr>
                    <th>총 상품 금액</th>
                    <td>{{ order.total_price | comma }}원</td>
                  </tr>
                  <tr>
                    <th>배송비</th>
                    <td>{{ order.total_delivery_fee | comma }}원</td>
                  </tr>
                  <tr>
                    <th>할인적용가</th>
                    <td>{{ order.total_point + order.total_coupon_price | comma }}원</td>
                  </tr>
                  <tr class="color_gray_7">
                    <th colspan="font_nomal">포인트 할인</th>
                    <td>{{ order.total_point | comma }}원</td>
                  </tr>
                  </tbody>
                  <tfoot>
                    <th>총 결제 금액</th>
                    <td><span class="brand_color"><b>{{ order.paid_price | comma }}원({{ order.total_amount }}개)</b></span></td>
                  </tfoot>
                </table>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/order/completed/_id/index.js"></script>
