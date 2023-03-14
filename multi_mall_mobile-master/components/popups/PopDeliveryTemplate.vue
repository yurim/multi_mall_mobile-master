<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">배송비 템플릿 상세보기</div>
            <div class="popup_text_wrap">
              <table>
                <tr>
                  <th>배송방법</th>
                  <td> deliveryInfo.delivery_method_str </td>
                </tr>
                <tr>
                  <th>배송비 지불 방법</th>
                  <td> deliveryInfo.fee_pay_method_str </td>
                </tr>
                <tr>
                  <th>묶음배송가능여부</th>
                  <td> deliveryInfo.delivery_group ? '가능' : '불가' </td>
                </tr>
                <tr>
                  <th>묶음배송</th>
                  <td>
                    deliveryInfo.delivery_group.name
                    <span class="font_10">
                          계산방식:  deliveryInfo.delivery_group.is_smaller ? '묶음 그룹에서 가장 작은 배송비로 부과' : '묶음 그룹에서 가장 큰 배송비로 부과' <br>
                          제주/도서산간 추가배송비 :  deliveryInfo.delivery_group.is_country_mountain ? '설정' : '설정안함'
                        </span>
                  </td>
                </tr>
                <tr>
                  <th>배송비 유형</th>
                  <td> deliveryInfo.delivery_fee_type_str </td>
                </tr>
                <tr>
                  <th>기본 배송비</th>
                  <td>
                     deliveryInfo.default_fee | comma<span class="m_l_10">원</span>
                  </td>
                </tr>
                <tr>
                  <th>배송비 조건</th>
                  <td>
                    <div>
                       deliveryInfo.condition_value <span class="m_l_10">원 이상 무료</span>
                    </div>
                    <div>
                       deliveryInfo.condition_value <span class="m_l_10">개 까지 추가배송비 없음</span>
                    </div>
                    <div>
                       deliveryInfo.condition_value <span class="m_l_10">개마다 기본배송비 반복 부과</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>제주/도서산간 추가 배송비</th>
                  <td>
                    <div class="radio_wrap m_b_10">
                      <span>3권역</span>
                      <span>2권역</span>
                      <br>
                      <a href="javascript:;" class="color_b under_line">도서산간지역 확인</a>
                    </div>

                    <div class="text_input_wrap w_100">
                        <div class="w_100"><b>제주 및 도서산간 추가 배송비</b></div>
                         item.additional_price | comma <span>원</span>
                        <div class="w_100"><b>제주 추가배송비</b></div>
                         item.additional_price | comma <span>원</span>
                        <div class="w_100"><b>제주 외 도서산간 추가배송비</b></div>
                         item.additional_price | comma <span>원</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>출고지(매장주소)</th>
                  <td>
                    <span>`[${deliveryInfo.departure_zipcode}] ${deliveryInfo.departure_address} ${deliveryInfo.departure_detail_address}` </span>
                  </td>
                </tr>
                <tr>
                  <th>반품/교환 택배사</th>
                  <td>
                     deliveryInfo.delivery_company_str
                  </td>
                </tr>
                <tr>
                  <th>반품배송비(편도)</th>
                  <td>
                    deliveryInfo.return_fee | comma<span class="m_l_10">원</span>
                  </td>
                </tr>
                <tr>
                  <th>반품배송비(왕복)</th>
                  <td> deliveryInfo.exchange_fee | comma <span class="m_l_10">원</span></td>
                </tr>
                <tr>
                  <th>반품/교환지</th>
                  <td>
                    <span>`[${deliveryInfo.arrival_zipcode}] ${deliveryInfo.arrival_address} ${deliveryInfo.arrival_detail_address}`</span>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="ok">확인</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    deliveryInfo: {
      type: Object,
      default: {},
    },
  },
  methods: {},
});
</script>
