<template>
  <div class="top_nav_bar">
<!--    todo: 두줄로 바꿔야하지 않을까요 ?? -->
    <ul v-if="currentPath.indexOf('mypage') > -1">
      <li
        v-for="(nav, i) in userNavList"
        :key="`nav_${i}`"
        :class="currentPath.indexOf(`mypage/${nav.parent}`) > 0 || nav.isChecked ? 'on' : ''"
        v-on:mouseover="nav.isChecked = !nav.isChecked"
        v-on:mouseout="nav.isChecked = !nav.isChecked"
      >
        <nuxt-link :to="`/mypage/${nav.parent}/${nav.child[0]}`">{{ nav.text }}</nuxt-link>
      </li>
    </ul>
    <ul class="nav_list" v-else>
      <li
        v-for="(nav, i) in nonUserNavList"
        :key="`nav_${i}`"
        :class="currentPath.indexOf(`non_member/${nav.parent}`) > 0 || nav.isChecked ? 'on' : ''"
        v-on:mouseover="nav.isChecked = !nav.isChecked"
        v-on:mouseout="nav.isChecked = !nav.isChecked"
      >
        <nuxt-link :to="`/non_member/${nav.parent}/${nav.child[0]}`">{{ nav.text }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopTabNav',
  data: () => ({
    currentPath: '',
    userNavList: [
      // {
      //   text: '주문 배송 조회',
      //   parent: 'order',
      //   child: ['', 'exchange', 'return', 'cancel'],
      //   isChecked: false,
      // },
      {
        text: '교환 / 취소 조회',
        parent: 'exchange',
        child: [''],
        isChecked: false,
      },
      // {
      //   text: '포인트 내역',
      //   parent: 'point',
      //   child: ['saving', 'using'],
      //   isChecked: false,
      // },
      // {
      //   text: '할인 쿠폰',
      //   parent: 'coupon',
      //   child: [''],
      //   isChecked: false,
      // },
      // {
      //   text: 'MY 리뷰',
      //   parent: 'review',
      //   child: [''],
      //   isChecked: false,
      // },
      {
        text: '문의 내역',
        parent: 'inquiry/product',
        child: [''],
        isChecked: false,
      },
      {
        text: '내 정보',
        parent: 'info',
        child: [''],
        isChecked: false,
      },
    ],
    nonUserNavList: [
      {
        text: '주문 배송 조회',
        parent: 'order',
        child: ['', 'exchange', 'return', 'cancel'],
        isChecked: false,
      },
      {
        text: '교환 / 취소 조회',
        parent: 'exchange',
        child: [''],
        isChecked: false,
      },
    ],
  }),
  created() {
    this.currentPath = this.$router.currentRoute.path;
  },
};
</script>

<style scoped></style>
