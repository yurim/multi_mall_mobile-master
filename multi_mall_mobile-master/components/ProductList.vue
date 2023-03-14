<template>
  <ul>
    <li class="list_inner" v-for="product in productList" :key="product.id">
      <product-summary :product="product"></product-summary>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'ProductList',
  props: {
    productList: Array,
  },
};
</script>
