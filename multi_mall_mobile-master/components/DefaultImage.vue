<template>
  <div class="img_bg_wrap" v-bind:style="{ backgroundImage: `url(${ imageUrl && imageUrl !== 'None' ? imageUrl : require('@/assets/img/product_default_img.png') })` }" ></div>
<!--  <div class="img_bg_wrap" v-bind:style="{ backgroundImage: `url(${ imageUrl && imageUrl !== 'None' ? imageUrl : require('@/assets/img/product_default_img.png') })` }" ></div>-->
<!--    <img :src="imageUrl ? imageUrl : require('@/assets/img/product_default_img.png')" :alt="imageUrl ? '상품 이미지' : '기본 이미지'" />-->
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultImage',
  props: {
    imageUrl: {
      type: String,
      default: '',
    },
  },
});
</script>
