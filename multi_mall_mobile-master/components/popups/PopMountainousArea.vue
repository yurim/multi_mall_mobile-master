<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap width_m">
            <div class="popup_title text-center">산간지역 주소</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap w_100">
                <li>
                  <table>
                    <colgroup>
                      <col width="70">
                      <col>
                      <col width="50">
                      <col width="50">
                    </colgroup>
                    <thead>
                    <tr>
                      <th>우편번호</th>
                      <th>주소지</th>
                      <th>제주권</th>
                      <th>제주 외 도서산간</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>item.zipcode</td>
                      <td>item.address</td>
                      <td>item.is_jeju ? 'O' : 'X'</td>
                      <td>item.is_country_mountain ? 'O' : 'X'</td>
                    </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td colspan="4">정보가 없습니다.</td>
                      </tr>
                    </tbody>
                  </table>

                </li>
                <li>
                  <div class="popup_pagenation_wrap w_100">
                  <div class="pagenation_wrap">
                    <v-pagination
                      v-model="defaultPage"
                      :length="pageSize"
                      :total-visible="totalVisible"
                    >
                    </v-pagination>
                  </div>
                  </div>
                </li>
              </ul>
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
    cmaList: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    pageSize: 0,
    defaultPage: 1,
    startCount: 0,
    endCount: 100,
    totalVisible: 7,
  }),
  created() {
    if (this.cmaList.length > 0) {
      const totalCount = this.cmaList.length / 100;
      this.pageSize = Number(totalCount.toFixed(0));
    }
  },
  computed: {
    cmaDataList() {
      if (this.cmaList.length > 0) {
        if (this.defaultPage > 1) this.startCount = (this.defaultPage - 1) * 100 + 1;
        else this.startCount = (this.defaultPage - 1) * 100;
        this.endCount = this.defaultPage * 100;
        return this.cmaList.slice(this.startCount, this.endCount);
      }
    },
  },
});
</script>
