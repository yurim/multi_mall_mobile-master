<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">송장정보 수정</div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap">
                <li>- 선택한 주문 중 처리 가능한 주문건만 노출됩니다.</li>
                <li>- 송장수정요청 상품을 선택한 후 배송방법, 택배사 선택 및 송장번호를 입력하여 수정할 수 있습니다.</li>
              </ul>

              <div class="color_main_01"><b>송장정보 수정상품</b></div>

              <div>
                <div class="m_b_40">
                  <table>
                    <thead>
                    <tr>
                      <th>
                        <div class="checkbox_wrap">
                          <input type="checkbox" id="all_check">
                          <label for="all_check"></label>
                        </div>
                      </th>
                      <th>상품주문번호</th>
                      <th>상품명</th>
                      <th>판매매장</th>
                      <th>총 상품 주문금액</th>
                      <th>배송방법</th>
                      <th>택배사</th>
                      <th>송장번호</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in items">
                      <td>
                        <div class="checkbox_wrap">
                          <input type="checkbox">
                          <label></label>
                        </div>
                      </td>
                      <td>item.productOrderNum</td>
                      <td>item.productName</td>
                      <td>item.storeNameKor</td>
                      <td>item.totalPrice 원</td>
                      <td>item.deliveryMethodStr</td>
                      <td>item.deliveryCompanyStr</td>
                      <td>item.invoiceNum</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <ul class="list_wrap">
                  <li>
                    <div class="title">배송방법</div>
                    <div class="body">
                      <select>
                        <option value="">선택</option>
                        <option>code.value</option>
                      </select>
                    </div>
                  </li>
                    <li>
                      <div class="title">택배사</div>
                      <div class="body">
                        <select >
                          <option value="">선택</option>
                          <option >code.value</option>
                        </select>
                      </div>
                    </li>
                    <li>
                      <div class="title">택배사</div>
                      <div class="body">
                        <input type="text" placeholder='송장번호를 입력해주세요.' class="w_100">
                      </div>
                    </li>
                </ul>

              </div>

            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">확인</button>
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
    allSelect: false,
    items: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    deliveryMethodCodeList: [],
    deliveryCompanyCodeList: [],
    params: {
      order_product_ids: [],
      delivery_method: '',
      delivery_company: '',
      invoice_num: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
  watch: {
    allSelect(newValue) {
      this.setCheck(newValue);
      this.onCheck();
    },
  },
  async created() {
    this.allSelect = true;
    this.setCheck(true);
    await this.$store.dispatch('common/getCodes', ['delivery_method', 'delivery_company']);
    this.deliveryMethodCodeList = this.codesArray('delivery_method');
    this.deliveryCompanyCodeList = this.codesArray('delivery_company');
    // this.params.delivery_method = this.deliveryMethodCodeList[0].key;
    // this.params.delivery_company = this.deliveryCompanyCodeList[0].key;
  },
  methods: {
    onCheck() {
      this.params.order_product_ids = this.items.filter((v) => v.isChecked).map((v) => v.id);
    },
    setCheck(checked) {
      this.items.forEach((item) => {
        item.isChecked = checked;
      });
    },
    setDeliveryMethod() {
      if (this.params.delivery_method === 'PARCEL') {
        this.params.delivery_company = '';
        this.params.invoice_num = '';
      }
    },
  },
});
</script>
