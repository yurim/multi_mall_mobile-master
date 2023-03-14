<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">반품 상세 내역</div>
            <div class="popup_text_wrap">

              <ul class="explain_wrap">
              </ul>

              <ul class="">
                <li class="main_title">상품 회수 정보</li>
              </ul>

              <table>
                <colgroup>
                  <col width="140">
                  <col>
                </colgroup>
                <tbody>
                  <tr>
                    <th>반송 방법</th>
                    <td class="color_main_01">{{ claim_order_product.order_product_collect.collect_delivery_type_str }}</td>
                  </tr>
                  <tr>
                    <th>수령인</th>
                    <td>{{ claim_order_product.store_return_exchange_info.holder_name }}</td>
                  </tr>
                  <tr>
                    <th>전화번호</th>
                    <td>{{ claim_order_product.store_return_exchange_info.cs_phone }}</td>
                  </tr>
                  <tr>
                    <th>반품지 주소</th>
                    <td>[{{ claim_order_product.store_return_exchange_info.zipcode }}] {{ claim_order_product.store_return_exchange_info.address }} {{ claim_order_product.store_return_exchange_info.detail_address }}</td>
                  </tr>
                </tbody>
              </table>

              <ul v-if="claim_order_product.order_product_collect.collect_fee_type === 'ATTACH'" class="w_100 border_line">
                <li class="main_title">반품 배송비 정보<span class="font_12"> (동봉)</span></li>
                <li><span class="font_10 d_ib_100 p_b_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
                <!-- *** 판매자 귀책사유 START *** -->
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <td colspan="2" class="admin_guide_txt">
                        <div>해당주문건의 반품사유가 판매자 귀책이므로 반품비용이 따로 발생하지 않습니다.</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>상품 취소 금액</th>
                      <td>{{ cancelProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ cancelDeliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>결제정보</th>
                      <td>{{ claim_order_product.payment_method_str }}<br>
                        <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 환불(예정) 금액</th>
                      <td><span class="brand_color"><b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b></span></td>
                    </tr>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </li>
                <!-- *** 판매자 귀책사유 END *** -->
                <!-- *** 고객 귀책사유 START *** -->
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th class="font_14">동봉 금액<br>(반품 배송비)</th>
                      <td>{{ claim_order_product.return_fee | comma }}원</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div class="guide_txt">해당 금액을 보내실 택배에 같이 동봉해주세요.</div>
                        <div>고객님이 동봉하실 금액 : <b class="color_main_01">300원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>상품 취소 금액</th>
                      <td>{{ cancelProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ cancelDeliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>결제정보</th>
                      <td>{{ claim_order_product.payment_method_str }}<br>
                        <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 환불(예정) 금액</th>
                      <td><span class="brand_color"><b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b></span></td>
                    </tr>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </li>
                <!-- *** 고객 귀책사유 END *** -->
              </ul>

              <ul v-if="claim_order_product.order_product_collect.collect_fee_type === 'VBANK'" class="w_100 border_line">
                <li>
                  <div class="main_title w_100">반품 배송비 정보<span class="font_12"> (무통장입금)</span></div>
                </li>
                <li><p class="font_10 d_ib_100 p_b_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</p></li>
                <!-- *** 판매자 귀책사유 START *** -->
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <td colspan="2" class="admin_guide_txt">
                        <div>해당주문건의 반품사유가 판매자 귀책이므로 반품비용이 따로 발생하지 않습니다.</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>상품 취소 금액</th>
                      <td>{{ cancelProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ cancelDeliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>결제정보</th>
                      <td>{{ claim_order_product.payment_method_str }}<br>
                        <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 환불(예정) 금액</th>
                      <td>
                        <span class="color_main_01">
                        <b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b>
                       </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </li>
                <!-- *** 판매자 귀책사유 END *** -->
                <!-- *** 고객 귀책사유 START *** -->
                <li>
                  <div class="cart_table_wrap w_100">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tbody>
                      <tr>
                        <th>은행명</th>
                        <td>{{ claim_order_product.store_return_exchange_info.bank_name }}</td>
                      </tr>
                      <tr>
                        <th>예금주</th>
                        <td>{{ claim_order_product.store_return_exchange_info.holder_name }}</td>
                      </tr>
                      <tr>
                        <th>계좌번호</th>
                        <td>{{ claim_order_product.store_return_exchange_info.account }}</td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                        <th>입금 금액</th>
                        <td>
                          <span class="color_main_01">
                            <b>{{ claim_order_product.exchange_fee | comma }}원</b>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="total_price_wrap">
                          <div class="guide_txt">해당금액을 위에 기재된 계좌번호로 입금해주시면 입금확인 후 반품처리 진행을 도와드리겠습니다.</div>
                          <div>고객님이 입금하실 금액 : <b class="color_main_01">300원</b></div>
                        </td>
                      </tr>
                      </tfoot>
                    </table>
                  </div>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>상품 취소 금액</th>
                      <td>{{ cancelProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ cancelDeliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>결제정보</th>
                      <td>{{ claim_order_product.payment_method_str }}<br>
                        <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 환불(예정) 금액</th>
                      <td>
                        <span class="color_main_01">
                          <b>{{cancelProductPrice + cancelDeliveryPrice | comma }}원</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </li>
                <!-- *** 고객 귀책사유 END *** -->
              </ul>

              <ul v-if="claim_order_product.order_product_collect.collect_fee_type === 'SELLER_DECIDES'" class="w_100 border_line">
                <li>
                  <div class="main_title w_100">반품 배송비 정보<span class="font_12"> (판매자와 상담 후 결정)</span></div>
                </li>
                <li><span class="font_10 d_ib_100 p_b_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
                <!-- *** 판매자 귀책사유 START *** -->
                <li>
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <td colspan="2" class="admin_guide_txt">
                        <div>해당주문건의 반품사유가 판매자 귀책이므로 반품비용이 따로 발생하지 않습니다.</div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <div class="cart_table_wrap w_100">
                    <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>상품 취소 금액</th>
                      <td>{{ cancelProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ cancelDeliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>결제정보</th>
                      <td>{{ claim_order_product.payment_method_str }}<br>
                        <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 환불(예정) 금액</th>
                      <td>
                        <span class="color_main_01">
                        <b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="total_price_wrap">
                        <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                  </div>
                </li>
                <!-- *** 판매자 귀책사유 END *** -->
                <!-- *** 고객 귀책사유 START *** -->
                <li>
                  <div class="cart_table_wrap w_100">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tbody>
                      <tr class="border_b_light">
                        <th>예상 반품 배송비</th>
                        <td v-if="reason_responsible_for !== 'SELLER'">{{ claim_order_product.return_fee | comma }}원</td>
                        <td v-else>0 원</td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                        <td colspan="2" class="total_price_wrap">
                          <div class="guide_txt">해당 금액의 지불방법은 판매자와 상의 후 결정해주세요.</div>
                          <div>고객님이 지불하실 금액 : <b class="color_main_01">300원</b></div>
                        </td>
                      </tr>
                      </tfoot>
                    </table>
                  </div>
                </li>
                <li class="main_title">환불 정보</li>
                <li>
                  <div class="cart_table_wrap w_100">
                    <table>
                      <colgroup>
                        <col width="140">
                        <col>
                      </colgroup>
                      <tbody>
                      <tr>
                        <th>상품 취소 금액</th>
                        <td>{{ cancelProductPrice | comma }}원</td>
                      </tr>
                      <tr>
                        <th>배송비</th>
                        <td>{{ cancelDeliveryPrice | comma }}원</td>
                      </tr>
                      <tr>
                        <th>결제정보</th>
                        <td>{{ claim_order_product.payment_method_str }}<br>
                          <span class="font_12">({{ claim_order_product.paid_at | date }})</span>
                        </td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                        <th>총 환불(예정) 금액</th>
                        <td>
                          <span class="color_main_01">
                           <b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="total_price_wrap">
                          <div>고객님이 환불받으실 금액 : <b class="color_main_01">200원</b></div>
                        </td>
                      </tr>
                      </tfoot>
                    </table>
                  </div>
                </li>
                <!-- *** 고객 귀책사유 END *** -->
              </ul>

              <ul class="w_100">
                <li>
                  <div class="main_title w_100">반품요청 사유<span class="font_12"> ({{reason_sub_type_str}})</span></div>
                </li>
                <li>
                  <div class="w_100">
                    <div class="title color_main_01 m_b_20 text-left"><b>상세 사유</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.reason" rows="3" :disabled="true"></textarea>
                    </div>
                  </div>
                </li>
                <li>
                  <div v-if="isReject" class="w_100">
                    <div class="color_main_01 m_b_20 text-left" ><b>반품거부 사유</b></div>
                    <div class="m_b_20">
                      <textarea rows="3" :disabled="true">{{ reject.reason }}</textarea>
                    </div>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
        <div class="popup_btn_wrap">
          <button @click="cancel">확인</button>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    order_product: {
      type: Object,
      default: {},
    },
    claim_order_product: {
      type: Object,
      default: {},
    },
    reason_sub_type: {
      type: String,
      default: '',
    },
    reason_sub_type_str: {
      type: String,
      default: '',
    },
    reason_responsible_for: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
    reject: {
      type: Object,
      default: {},
    },
  },
  data: (vm) => ({
    codeList: [],
    isReject: false,
    params: {
      reason_sub_type: vm.reason_sub_type,
      reason: vm.reason,
    },
    cancelProductPrice: 0,
    cancelDeliveryPrice: 0,
  }),
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
    reasonLength() {
      return this.params.reason.length;
    },
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type']);
    this.codeList = this.codesValueArray('reason_sub_type', 'RQST_EXCHNG');
    if (!this.params.reason_sub_type) this.params.reason_sub_type = this.codeList[0].value.code;
    if (Object.keys(this.reject).length > 0) this.isReject = true;

    this.cancelProductPrice = this.claim_order_product.product_discount_price ? this.claim_order_product.product_discount_price : this.claim_order_product.product_price;
    this.cancelDeliveryPrice = this.claim_order_product.delivery_fee ? this.claim_order_product.delivery_fee : 0;
  },
  methods: {},
});
</script>
