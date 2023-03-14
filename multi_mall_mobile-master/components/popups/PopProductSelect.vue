<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap w_xl">
            <div class="popup_title text-center">대표상품선택</div>

            <div class="search_wrap">
              <div class="search_wrap__title"><b>검색</b></div>
              <div class="search_wrap__body">
                <div class="two_btn_input_wrap">
                  <input type="text" placeholder="제품명을 적어주세요.">
                  <a href="javascript:;">검색</a>
                  <a href="javascript:;">초기화</a>
                </div>
              </div>
            </div>

            <div class="bottom_product_wrap">
              <div class="small_btn_wrap pull-right m_b_10">
                <a href="javascript:;">선택 추가</a>
                <a href="javascript:;">선택 제거</a>
              </div>

              <div class="product_wrap">
                <div>
                  <td><span class="text">item.name</span></td>
                  <td><span class="text">item.create_at</span></td>
                  <td>
                   <span class="text square_but_wrap">
                    <a class="line_but">수정</a>
                    </span>
                  </td>
                </div>
                <div>
                  <td><span class="text">item.name</span></td>
                  <td><span class="text">item.create_at</span></td>
                  <td>
                    <span class="text square_but_wrap"><a class="line_but">수정</a></span>
                  </td>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">저장</button>
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
  methods: {},
  data: () => ({
    loading: false,
    headers: [
      { text: '이미지', value: '', sortable: false, width: '100' },
      { text: '제목', value: '', sortable: false },
      { text: '가격', value: '', sortable: false, width: '100' },
    ],
  }),
});
</script>
