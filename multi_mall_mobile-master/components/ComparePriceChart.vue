<template>
  <div class="chart_wrap" :class="this.sizeSmall ? 'list' : '' ">
    <div class="chart_wrap__text">
      <template v-if="this.sizeSmall">
        <b>고객님</b>께서 <b>지금 절약</b>할 수 있는 <b>금액</b>은<br>
        최대 <span class="color_main_01 price_icon_mint">{{ subPrice | comma }} </span>원 입니다.
      </template>
      <template v-else>
        지금 최저가 상품을 구매하시면 최고가와 비교해서<br>
        최대 <b class="color_main_01">{{ subPrice | comma }} </b>원을 절약하실 수 있습니다.
      </template>
    </div>
    <div class="chart_wrap__chart">
      <div class="minimum_price_wrap">
        <div class="text">최저가</div>
        <div class="bar_wrap">
          <div class="bar" :style="{'width': `${minPercent}%`}">
            <div class="chart_wrap__percent"><span class="triangle bottom">{{minPercent}}%</span></div>
          </div>
        </div>
      </div>
      <div class="maximum_price_wrap">
        <div class="text">최고가</div>
        <div class="bar_wrap">
          <div class="bar" style="width: 100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComparePriceChart',
  props: {
    sizeSmall: {
      type: Boolean,
    },
    positionFixed: {
      type: Boolean,
    },
    ScrollBtn: {
      type: Boolean,
    },
    lowestProduct: {
      type: Object,
    },
    highestProduct: {
      type: Object,
    },
  },
  computed: {
  },
  data() {
    return {
      subPrice: 0,
      minPercent: 0,
    };
  },
  mounted() {
    if (this.lowestProduct && this.highestProduct) this.calcPrice();
  },
  methods: {
    calcPrice() {
      let lowestPrice = this.lowestProduct.discount_price ? this.lowestProduct.discount_price : this.lowestProduct.price;
      if (this.lowestProduct.display_only && this.lowestProduct.abroad_price) {
        lowestPrice = this.lowestProduct.abroad_price.price + this.lowestProduct.abroad_price.delivery_fee;
      }
      const highestPrice = this.highestProduct.price;
      this.subPrice = highestPrice - lowestPrice;
      this.minPercent = Math.floor((lowestPrice / highestPrice) * 100);
    },
  },
};

</script>
