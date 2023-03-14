<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap w_m">
            <div class="popup_content_wrap">
              <div>
                <table>
                  <colgroup>
                    <col width="100">
                    <col>
                    <col width="100">
                  </colgroup>
                  <thead>
                  <tr style="cursor: pointer;" class="text-center">
                    <th>배송지명</th>
                    <th>배송정보</th>
                    <th>선택/수정</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-if="deliveries.length > 0">
                    <tr v-for="delivery in deliveries" class="text-left">
                      <td @click="selectDelivery(delivery)">
                        <div>{{ delivery.address_name }}</div>
                        <div class="color_main_01" v-if="delivery.is_default">[기본 배송지]</div>
                      </td>
                      <td @click="selectDelivery(delivery)">
                        <div class="m_b_10">{{ delivery.receiver_name }}</div>
                        <div class="m_b_10">{{ delivery.address }} {{ delivery.detail_address }}</div>
                        <div>{{ delivery.phone }}</div>
                      </td>
                      <td>
                        <div class="small_btn_wrap">
                          <a href="javascript:;" class="w_100 m_b_10" @click="selectDelivery(delivery)">선택</a>
                          <a href="javascript:;" class="brand_line_btn w_100 m_b_10" @click="updateDelivery(delivery)">수정</a>
                          <a href="javascript:;" class="brand_btn w_100" @click="deleteDelivery(delivery)">삭제</a>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="text-center">
                      <td colspan="3">현재 등록된 배송지가 없습니다.</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">닫기</button>
          <button @click="addDelivery">배송지 추가</button>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

const prefix = 'order';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    userId: {
      type: Number,
      default: null,
    },
    deliveries: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  async created() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      const res = await this.$store.dispatch(`${prefix}/get_deliveries`, {
        user_id: this.userId,
      });
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      this.deliveries = res.data.data.deliveries;
    },
    selectDelivery(delivery) {
      this.params.delivery = delivery;
      this.ok();
      this.$destroy();
    },
    addDelivery() {
      new this.$popup.AddressModify({
        propsData: {
          delivery: {
            user_id: this.userId,
          },
          okCallback: async (params) => {
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    updateDelivery(delivery) {
      new this.$popup.AddressModify({
        propsData: {
          delivery: JSON.parse(JSON.stringify(delivery)),
          okCallback: async (params) => {
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    deleteDelivery(delivery) {
      new this.$popup.Confirm({
        propsData: {
          title: '배송지를 삭제 하시겠습니까?',
          okCallback: async (params) => {
            params.$destroy();
            const res = await this.$store.dispatch(`${prefix}/delete_delivery`, delivery);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
            await this.refresh();
            this.$popup.showAlertPopup('삭제되었습니다.');
          },
        },
      }).$mount();
    },
  },
});
</script>
