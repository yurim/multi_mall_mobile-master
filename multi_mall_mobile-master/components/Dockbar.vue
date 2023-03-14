<template>
  <div>
    <div class="mobile_dockbar">
      <!-- *** 메인 탭 START *** -->
      <!-- 상품상세/장바구니 제외한 페이지에서 보여줌 -->
      <template v-if="['product-id', 'cart'].indexOf(currentPageName) === -1">
        <div class="dockbar_list">
          <ul>
            <li
              v-for="(menu, i) in dockMenuList"
              :key="`nav_${i}`"
              :class="currentPath.indexOf(menu.parent) >= 0 || menu.isChecked ? 'on' : ''"
            >
              <nuxt-link :to="`/${menu.parent}/${menu.child[0]}`">{{ menu.text }}</nuxt-link>
            </li>
          </ul>
        </div>
      </template>
      <!-- *** 메인 탭 END *** -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dockbar',
  data: () => ({
    currentPath: '',
    currentPageName: '',

    dockMenuList: [
      {
        text: 'HOME',
        parent: 'main',
        child: [''],
        isChecked: false,
      },
      {
        text: 'STORE',
        parent: 'store',
        child: [''],
        isChecked: false,
      },
      {
        text: 'MY PAGE',
        parent: 'mypage',
        child: ['order'],
        isChecked: false,
      },
      {
        text: 'CART',
        parent: 'cart',
        child: [''],
        isChecked: false,
      },
    ],
    isProductDetailPage: false,
    onByeWrap: false,
  }),
  created() {
    this.currentPath = this.$router.currentRoute.path;
    this.currentPageName = this.$router.currentRoute.name;
  },
};
</script>
