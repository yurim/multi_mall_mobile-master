<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap width_m">
            <div class="popup_title">외부 상품 등록하기</div>

            <div class="popup_content_wrap">

              <div class="table_wrap">
                <table>
                  <colgroup>
                    <col width="110">
                    <col>
                  </colgroup>
                  <tbody>

                  <!-- *** 카테고리 START *** -->
                  <tr>
                    <th>카테고리</th>
                    <td>
                      <div class="even_child_wrap">
                        <select>
                          <option>선택</option>
                          <option>item.name</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 카테고리 END *** -->

                  <!-- *** 판매상태 START *** -->
                  <tr>
                    <th>판매상태</th>
                    <td>
                      <div class="radio_wrap">
                        <input type="radio" id="is_sale_true">
                        <label for="is_sale_true">판매중</label>
                        <input type="radio" id="is_sale_false">
                        <label for="is_sale_false">판매중지</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 판매상태 END *** -->

                  <!-- *** 진열상태 START *** -->
                  <tr>
                    <th>진열상태</th>
                    <td>
                      <div class="radio_wrap">
                        <input type="radio" id="is_listed_true">
                        <label for="is_listed_true">진열함</label>
                        <input type="radio" id="is_listed_false">
                        <label for="is_listed_false">진열안함</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 진열상태 END *** -->

                  <!-- *** 판매가 START *** -->
                  <tr>
                    <th>판매가 수정</th>
                    <td>
                      <div class="d_ib_100 m_b_10">
                        <!-- *** 화폐단위 변환 START *** -->
                        <template>
                          <div><b>판매가 화폐단위 변환</b></div>
                          <div class="input_div_wrap">
                            <div class="l_h_34">`${exchange.name} (${exchange.unit}) = `</div>
                            <input type="number">
                          </div>
                        </template>
                        <!-- *** 화폐단위 변환 END *** -->

                        <!-- *** 상품 추가금액 설정 START *** -->
                        <div>
                          <div class="radio_wrap m_b_10">
                            <input type="radio" id="is_change_price_false">
                            <label for="is_change_price_false">수정안함</label>
                            <input type="radio" id="is_change_price_true">
                            <label for="is_change_price_true">수정</label>
                          </div>
                        </div>
                        <div v-if="isChangePrice">
                          <div class="d_ib_100 m_b_10"><b>상품추가금액 설정</b></div>
                          <div class="radio_wrap m_b_10">
                            <input type="radio" id="extra_price_type_rate" value="rate">
                            <label for="extra_price_type_rate">배율</label>
                            <input type="radio" id="extra_price_type_number" value="number">
                            <label for="extra_price_type_number">특정금액</label>
                            <input type="radio" id="extra_price_type_compound" value="compound">
                            <label for="extra_price_type_compound">복합</label>
                          </div>

                          <div class="input_but_wrap">
                            <input class="m_b_10" type="number" placeholder="% 입력">
                            <input class="m_b_10" type="number" placeholder="특정금액 입력">
                          </div>

                          <div>
                            <div class="d_ib_100 m_t_10 m_b_10"><b>옵션추가금액 설정</b> <a href="javascript:;" class="question_mark_btn">?</a></div>
                            <div class="radio_wrap m_b_10">
                              <input type="radio" id="additional_price_type_rate" value="product_price">
                              <label for="additional_price_type_rate">판매가에만 적용</label>
                              <input type="radio" id="additional_price_type_all" value="all">
                              <label for="additional_price_type_all">옵션에도 적용</label>
                            </div>
                          </div>
                        </div>
                        <!-- *** 상품 추가금액 설정 END *** -->
                      </div>
                    </td>
                  </tr>
                  <!-- *** 판매가 END *** -->

                  <!-- *** 배송비 템플릿 START *** -->
                  <tr>
                    <th>배송비</th>
                    <td>
                      <div class="input_but_wrap">
                        <select>
                          <option>선택</option>
                          <option>info.name</option>
                        </select>
                        <a class="small_but_style pull-right">상세보기</a>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 배송비 템플릿 END *** -->

                  <!-- *** 상품정보고시 템플릿 START *** -->
                  <tr>
                    <th>상품정보고시</th>
                    <td>
                      <select>
                        <option>선택</option>
                        <option>item.name</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 상품정보고시 템플릿 END *** -->

                  <!-- *** 배송정보고시 템플릿 START *** -->
                  <tr>
                    <th>배송정보고시</th>
                    <td>
                      <select>
                        <option>선택</option>
                        <option>item.name</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 배송정보고시 템플릿 END *** -->

                  <!-- *** 교환/반품 템플릿 START *** -->
                  <tr>
                    <th>교환/반품</th>
                    <td>
                      <select>
                        <option>선택</option>
                        <option>item.name</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 교환/반품 템플릿 END *** -->

                  <!-- *** 해외상품정보고시 템플릿 START *** -->
                  <tr>
                    <th>해외상품정보고시 (상단)</th>
                    <td>
                      <select>
                        <option>선택</option>
                        <option>item.name</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>해외상품정보고시 (하단)</th>
                    <td>
                      <select>
                        <option>선택</option>
                        <option>item.name</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 해외상품정보고시 템플릿 END *** -->

                  <!-- *** 중복상품 등록 START *** -->
                  <tr>
                    <th>중복상품 등록</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_duplicated">
                        <label for="is_duplicated">중복상품 등록 허용</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 중복상품 등록 END *** -->
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok" id="popup_btn_ok">등록</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import _ from 'lodash';
import PopupMixin from './popupMixin';

const prefix = 'store_admin/product/linkage';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    currencyUnits: {
      type: Array,
      default: [],
    },
    isAbroad: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    params: {
      data: {},
    },

    // category
    copiedCategories: [],
    selectedCategories: [''],

    // exchanges
    exchanges: [],

    // from
    isSale: true,
    isListed: true,
    isChangePrice: false,
    extraPriceType: 'rate',
    extraPriceRate: null,
    extraPriceNumber: null,
    additionalPriceType: 'product_price',
    selectedDeliveryInfo: '',
    selectedProductNoticeTemplate: '',
    selectedDeliveryNoticeTemplate: '',
    selectedExchangeReturnTemplate: '',
    selectedABRDProductTopNoticeTemplate: '',
    selectedABRDProductBtmNoticeTemplate: '',
    isDuplicated: false,
  }),
  computed: {
    ...mapGetters({
      categories: `${prefix}/categories`,
      codesArray: 'common/codesArray',
      deliveryInfo: `${prefix}/deliveryInfo`,
      templates: `${prefix}/templates`,
    }),
  },
  async created() {
    await this.$store.dispatch(`${prefix}/getCategories`);
    await this.$store.dispatch(`${prefix}/getDeliveryInfos`);
    await this.$store.dispatch(`${prefix}/getTemplates`);

    this.init();
  },
  methods: {
    init() {
      // init fist category
      this.copiedCategories.push(this.categories);

      this.exchanges = this.currencyUnits;
    },
    ok() {
      if (this.okCallback) {
        const check = this.checkTransfer();
        if (check) {
          const data = this.setData();
          if (data) {
            this.params.data = data;
            this.okCallback(this.params);
          }
        }
      }
    },

    checkTransfer() {
      if (!this.selectedCategories) return this.$popup.showAlertPopup('카테고리를 선택해주세요');
      let lastCategory = null;
      this.selectedCategories.forEach((v) => { if (v && !v.hasChild) lastCategory = v; });
      if (!lastCategory) return this.$popup.showAlertPopup('카테고리를 선택해주세요');
      if (this.exchanges) {
        if (_.find(this.exchanges, (v) => !v.rate)) return this.$popup.showAlertPopup('환율을 입력해주세요.');
      }
      if (this.isChangePrice) {
        if (this.extraPriceType === 'rate' && !this.extraPriceRate) return this.$popup.showAlertPopup('배율을 입력해주세요');
        if (this.extraPriceType === 'number' && !this.extraPriceNumber) return this.$popup.showAlertPopup('특정금액을 입력해주세요');
        if (this.extraPriceType === 'compound' && !(this.extraPriceRate && this.extraPriceNumber)) return this.$popup.showAlertPopup('배율과 특정금액을 입력해주세요');
      }
      if (!this.selectedDeliveryInfo) return this.$popup.showAlertPopup('배송비를 선택해주세요');
      if (!this.selectedProductNoticeTemplate) return this.$popup.showAlertPopup('상품정보고시를 선택해주세요');
      if (!this.selectedDeliveryNoticeTemplate) return this.$popup.showAlertPopup('배송정보고시를 선택해주세요');
      if (!this.selectedExchangeReturnTemplate) return this.$popup.showAlertPopup('교환/반품을 선택해주세요');
      if (this.isAbroad) {
        if (!this.selectedABRDProductTopNoticeTemplate) return this.$popup.showAlertPopup('해외상품정보고시(상단)을 선택해주세요');
        if (!this.selectedABRDProductBtmNoticeTemplate) return this.$popup.showAlertPopup('해외상품정보고시(하단)을 선택해주세요');
      }
      return true;
    },

    setData() {
      let lastCategory = null;
      this.selectedCategories.forEach((v) => {
        if (v && !v.hasChild) lastCategory = v;
      });

      const data = {
        category_id: lastCategory._id,
        is_sale: this.isSale,
        is_listed: this.isListed,
        is_change_price: this.isChangePrice,
        delivery_info_id: this.selectedDeliveryInfo.id,
        product_notice_template_id: this.selectedProductNoticeTemplate.id,
        delivery_notice_template_id: this.selectedDeliveryNoticeTemplate.id,
        exchange_return_template_id: this.selectedExchangeReturnTemplate.id,
        is_duplicated: this.isDuplicated,
      };

      if (this.exchanges) {
        const tempExchanges = {};
        this.exchanges.forEach((v) => {
          tempExchanges[v.iso] = Number(v.rate);
        });
        data.exchanges = tempExchanges;
      }

      if (this.isChangePrice) {
        data.extra_price_type = this.extraPriceType;
        data.extra_price_rate = Number(this.extraPriceRate);
        data.extra_price_number = Number(this.extraPriceNumber);
        data.additional_price_type = this.additionalPriceType;
      }

      if (this.isAbroad) {
        data.abroad_product_top_notice_id = this.selectedABRDProductTopNoticeTemplate.id;
        data.abroad_product_bottom_notice_id = this.selectedABRDProductBtmNoticeTemplate.id;
      }

      return data;
    },

    /**
     * 카테고리 선택
     */
    async selectedCategory(index) {
      const startCount = Number(index) + 1;
      const deleteCount = this.copiedCategories.length - startCount;

      // clear childes
      this.copiedCategories.splice(startCount, deleteCount);
      this.selectedCategories.splice(startCount, deleteCount);

      // get child categories
      const currCategory = this.selectedCategories[index];
      if (currCategory === '') return;
      if (currCategory.name.indexOf('전체') === -1) {
        const query = { _id: currCategory._id };
        const res = await this.$store.dispatch(`${prefix}/getCategories`, query);
        if (res.data.categories.length > 0) {
          const categoryList = res.data.categories;
          await this.copiedCategories.splice(startCount, 1, categoryList);
          await this.selectedCategories.splice(startCount, 1, '');
        }
      }
    },

    /**
     * 옵션추가금액 설명 팝업
     */
    showAddPriceTypeInfoPopup() {
      this.$popup.showAlertPopup('옵션 추가금액 설정 설명\n환율만 적용: 상품 추가금액을 제외한 환율만 옵션 추가금액에 적용\n모두 적용: 환율 및 상품 추가금액이 모두 적용');
    },

    /**
     * 배송비 템플릿 상세보기 팝업
     */
    async showDeliveryInfoPopup() {
      const deliveryInfo = this.selectedDeliveryInfo;
      if (deliveryInfo === '') {
        return this.popupAlert('배송비를 선택해 주세요.');
      }

      const res = await this.$store.dispatch(`${prefix}/getDeliveryInfoDetail`, deliveryInfo.id);
      if (res.data.deliveryInfo) {
        new this.$popup.DeliveryTemplate({
          propsData: {
            deliveryInfo: res.data.deliveryInfo,
            okCallback: async (params) => params.$destroy(),
          },
        }).$mount();
      }
    },
  },
});
</script>
