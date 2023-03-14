<template>
  <div class="star_rate_wrap" v-bind:class="{readonly: readonly}">
    <div class="rate" v-bind:class="{size_l: size_l}">
      <input :id="`rate${rateNumber}-star5`" type="radio" :name="`rate${rateNumber}`" value="5" @click="setStar" class="radioRateStar" v-bind:disabled="disabled === true" />
      <label :for="`rate${rateNumber}-star5`" title="five"></label>

      <input :id="`rate${rateNumber}-star4`" type="radio" :name="`rate${rateNumber}`" value="4" @click="setStar" class="radioRateStar" v-bind:disabled="disabled === true" />
      <label :for="`rate${rateNumber}-star4`" title="four"></label>

      <input :id="`rate${rateNumber}-star3`" type="radio" :name="`rate${rateNumber}`" value="3" @click="setStar" class="radioRateStar" v-bind:disabled="disabled === true" />
      <label :for="`rate${rateNumber}-star3`" title="three"></label>

      <input :id="`rate${rateNumber}-star2`" type="radio" :name="`rate${rateNumber}`" value="2" @click="setStar" class="radioRateStar" v-bind:disabled="disabled === true" />
      <label :for="`rate${rateNumber}-star2`" title="too"></label>

      <input :id="`rate${rateNumber}-star1`" type="radio" :name="`rate${rateNumber}`" value="1" @click="setStar" class="radioRateStar" v-bind:disabled="disabled === true" />
      <label :for="`rate${rateNumber}-star1`" title="one"></label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    size_l: {
      type: Boolean,
      default: false,
    },
    star: {
      type: [Number, String],
      default: 0,
    },
    rateNumber: {
      default: 0,
    },
  },
  data: () => ({
    checked: '',
  }),
  mounted() {
    if (this.star > 0 && this.readonly === true && this.disabled === true) this.initStar();
  },
  methods: {
    initStar() {
      document.getElementById(`rate${this.rateNumber}-star${this.star}`).checked = true;
    },
    setStar(e) {
      if (this.star === 0 && this.readonly === false && this.disabled === false) {
        this.checked = e.target.value;
        this.$emit('setStar', e.target.value);
      }
    },
  },
};
</script>
