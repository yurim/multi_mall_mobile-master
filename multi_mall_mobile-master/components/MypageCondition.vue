<template>
  <client-only>
  <div class="mypage_icon_box">
    <ul>
      <li>
        <nuxt-link to="/mypage/order">
          <div class="icon_wrap">
            <i class="order_icon"></i>
          </div>
          <div class="text_warp">
            <div class="info_txt">주문 배송</div>
            <div class="info_count"><span>{{ orderCount | comma }}</span>건</div>
          </div>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link class="num_wrap" to="/mypage/point/saving">
          <div class="icon_wrap">
            <i class="point_icon"></i>
          </div>
          <div class="text_warp">
            <div class="info_txt">포인트</div>
            <div class="info_count"><span>{{ currentPoint | comma }}</span>P</div>
          </div>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link class="num_wrap" to="/mypage/review">
          <div class="icon_wrap">
            <i class="review_icon"></i>
          </div>
          <div class="text_warp">
            <div class="info_txt">MY 리뷰</div>
            <div class="info_count"><span>{{ reviewCount | comma }}</span>건</div>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex';

const prefix = 'mypage';

export default {
  name: 'MypageCondition',
  computed: {
    ...mapGetters({
      orderCount: `${prefix}/orderCount`,
      currentPoint: `${prefix}/currentPoint`,
      reviewCount: `${prefix}/reviewCount`,
    }),
  },
  async created() {
    await this.$store.dispatch(`${prefix}/getSummery`);
  },
};
</script>

<style scoped>
</style>
