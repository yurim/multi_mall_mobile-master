<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="mypage_info_wrap">
        <div class="main_title_wrap">
          <h2>마이페이지</h2>
        </div>

        <!-- *** 마이페이지 탭 메뉴 START *** -->
        <TopTabNav></TopTabNav>
        <!-- *** 마이페이지 탭 메뉴 END *** -->

        <div>
          <div class="order_list_wrap">
            <div class="info_top">
              <div class="order_info_txt">
                <span><em>일시:</em> {{ $moment(orderProduct.ordered_at).format('YYYY년MM월DD일 HH시mm분') }}</span>
                <span><em>주문번호:</em> {{ orderProduct.order_num }}</span>
              </div>
              <div class="store_info_txt">
                <div class="info_txt pull-left">Store: <nuxt-link :to="`/store/${orderProduct.store_id}`">{{ orderProduct.store_name_kor }}</nuxt-link></div>
              </div>
            </div>
            <div class="order_list">
              <ul>
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
                          배송비: {{ orderProduct.delivery_fee | comma }}원 ({{ orderProduct.fee_pay_method_str }})
                        </span><br/>
                        <span class="upfront pull-right">할인적용가: - {{ orderProduct.product_discount_price || orderProduct.product_discount_price > 0 ? (orderProduct.product_price - orderProduct.product_discount_price) * orderProduct.amount : 0 | comma }}원</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
<!--            <div class="total_price_wrap_clearfix">-->
<!--              <span class="price_name">총 결제 금액</span>-->
<!--              <p class="price brand_color">32,000원 (0개)</p>-->
<!--            </div>-->
          </div>
          <div class="order_info_wrap">
            <div class="order_info_group">
              <div class="info_title">교환 사유</div>
              <ul>
                <li>
                  <div class="info_txt">사유</div>
                  <div class="select_wrap">
                    <select v-model="selectedReasonObject" v-on:change="setReasonType">
                      <option value="">선택</option>
                      <option v-for="type in reasonSubTypeCodes" :key="type.value.code" :value="type.value">{{ type.value.name }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="info_txt">내용</div>
                  <div class="content_info">
                    <textarea placeholder="내용을 입력해주세요." v-model="order_product_exchange.reason"></textarea>
                  </div>
                </li>
              </ul>
            </div>
            <div class="order_info_group">
              <div class="info_title">상품 회수</div>
              <ul>
                <li>
                  <div class="status_name">반송 방법</div>
                  <div class="status_info">
                    <div class="radio_wrap">
                      <template v-for="type in collectDeliveryTypeCodes">
                        <input type="radio" name="collectDeliveryType" :key="`collectDeliveryType_${type.key}`" :id="`${type.key}_${type.value.code}`" :value="type.value.code" v-model="order_product_exchange.collect_delivery_type">
                        <label :for="`${type.key}_${type.value.code}`" :key="`collectDeliveryType_${type.value.code}`">{{ type.value.name }}</label>
                      </template>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="status_name">수령인</div>
                  <div class="status_info">{{ orderProduct.store_return_exchange_info.holder_name }}</div>
                </li>
                <li>
                  <div class="status_name">전화번호</div>
                  <div class="status_info">{{ orderProduct.store_return_exchange_info.cs_phone }}</div>
                </li>
                <li>
                  <div class="status_name">반품지 주소</div>
                  <div class="status_info">[{{ orderProduct.store_return_exchange_info.zipcode }}] {{ orderProduct.store_return_exchange_info.address }} {{ orderProduct.store_return_exchange_info.detail_address }}</div>
                </li>
              </ul>
            </div>
            <div class="order_info_group">
              <div class="info_title">교환 배송비</div>
              <ul v-if="selectedReasonObject.responsible_for !== 'SELLER'">
                <li>
                  <div class="status_name">지불 방법</div>
                  <div class="status_info">
                    <div class="radio_wrap">
                      <template v-for="type in collectFeeTypeCodes">
                        <input type="radio" name="collectFeeType" :id="`${type.key}_${type.value.code}`" :value="type.value.code" v-model="order_product_exchange.collect_fee_type" :key="`collectFeeType_${type.key}`">
                        <label :for="`${type.key}_${type.value.code}`" :key="`collectFeeType_${type.value.code}`">{{ type.value.name }}</label>
                      </template>
                    </div>
                  </div>
                </li>
              </ul>
              <ul v-if="order_product_exchange.collect_fee_type === 'ATTACH'">
                <li class="info_title">교환 배송비 정보 <span class="font_10">(동봉)</span></li>
                <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
                <li>
                  <div class="cart_table_wrap">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tfoot>
                      <th>동봉 금액</th>
                      <td><span class="color_main_01"><b>{{ orderProduct.exchange_fee | comma }}원</b></span></td>
                      </tfoot>
                    </table>
                  </div>
                </li>
              </ul>

              <ul v-if="order_product_exchange.collect_fee_type === 'VBANK'">
                <li class="info_title">교환 배송비 정보 <span class="font_10">(무통장입금)</span></li>
                <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
                <li>
                  <div class="cart_table_wrap">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tbody>
                      <tr>
                        <th>은행명</th>
                        <td>{{ orderProduct.store_return_exchange_info.bank_name }}</td>
                      </tr>
                      <tr>
                        <th>예금주</th>
                        <td>{{ orderProduct.store_return_exchange_info.holder_name }}</td>
                      </tr>
                      <tr>
                        <th>계좌번호</th>
                        <td>{{ orderProduct.store_return_exchange_info.account }}</td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <th>입금 금액</th>
                      <td><span class="color_main_01"><b>{{ orderProduct.exchange_fee | comma }}원</b></span></td>
                      </tfoot>
                    </table>
                  </div>
                </li>
              </ul>

              <ul v-if="order_product_exchange.collect_fee_type === 'SELLER_DECIDES'">
                <li class="info_title">교환 배송비 정보 <span class="font_10">(판매자와 상담 후 결정)</span></li>
                <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
                <li>
                  <div class="cart_table_wrap">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tfoot>
                      <th>예상 배송비</th>
                      <td>
                        <span class="color_main_01">
                          <b v-if="selectedReasonObject.responsible_for !== 'SELLER'">{{ orderProduct.exchange_fee | comma }}원</b>
                          <b v-else>0 원</b>
                        </span>
                      </td>
                      </tfoot>
                    </table>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="but_wrap">
          <a class="line_but" v-on:click="cancelExchange">취소</a>
          <a v-on:click="requestExchange">교환 요청</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/mypage/order/exchange/_id/index.js"></script>
