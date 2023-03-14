<template>
  <div style="margin: 40px">
    <button @click="showPopup">
      팝업보기
    </button>

    <search-form
      :onSearch="onSearch"
      :onReset="onReset"
    >
      <search-keyword
        ref="searchKeyword"
        :placeholder="'선택쓰'"
        :classify="'keyword'"
        :items="[
          { text: '매장명', value: 'store_name' },
          { text: '담당자이름', value: 'manager_name' },
        ]"
      />
      <search-checkbox
        ref="searchStoreType"
        :classify="'store_type'"
        :items="[
          { text: '로드샵', value: 'load_shop' },
          { text: '인터넷쇼핑몰', value: 'internet' },
          { text: '디자이너 브랜드', value: 'designer' },
          { text: '해외직구 쇼핑몰', value: 'tao' },
        ]"
      />
      <search-radio
        ref="searchStoreRadio"
        :classify="'store_radio'"
        :items="[
          { text: '로드샵', value: 'load_shop' },
          { text: '인터넷쇼핑몰', value: 'internet' },
          { text: '디자이너 브랜드', value: 'designer' },
          { text: '해외직구 쇼핑몰', value: 'tao' },
        ]"
      />
      <search-date-picker
        ref="searchDatePicker"
        dateFormat="YYYY-MM-DDzz"
        :dateTypes="[
          { text: '구매일', value: 'buy_date' },
          { text: '구매일2', value: 'buy_date2' },
        ]"
      ></search-date-picker>
      <br><br><br>
      <search-select-order-state
        ref="searchSelectOrderState"
        :orderStates="[
          { text: '전체', value: '' },
          { text: '발송대기', value: 'DLVRY_WAIT' },
          { text: '배송중', value: 'DLVRNG' },
          { text: '배송완료', value: 'DLVRY_CMPLT' },
        ]"
        :orderSubStates="[
          { text: '전체', value: '' },
          { text: '신규주문', value: 'NEW_ORDR' },
          { text: '발주확인', value: 'CHCK_DLVRY' },
        ]"
      ></search-select-order-state>
      <search-select
        ref="searchSelect"
        :classify="'delivery_type'"
        :items="[
          { text: '전체', value: '' },
          { text: '택배/등기/소포', value: 'type1' },
          { text: '직접전달', value: 'type2' },
          { text: '방문수령', value: 'type3' },
          { text: '퀵서비스', value: 'type4' },
          { text: '배송없음', value: 'type5' },
        ]"
      ></search-select>
    </search-form>

    <data-table
      ref="dataTable"
      :loading="loading"
      :headers="headers"
      :items="items"
      :total="total"
      :on-table-option="onTableOption"
      :default-page="1"
      :draggable="true"
      :selectable="true"
      :default-items-per-page="3"
    >
      <template v-slot:body="{item}">
        <td><img :src="item.url"></td>
        <td><input type="text" :value="item.name"></td>
        <td><span class="text"> item.calories </span></td>
        <td><span class="text"> item.fat </span></td>
        <td><span class="text"> item.carbs </span></td>
        <td><span class="text"> item.protein </span></td>
        <td><span class="text"> item.iron </span></td>
      </template>
    </data-table>
    <v-btn @click="printSelectedItems">
      getSelectedItems
    </v-btn>
    <br><span> JSON.stringify(selectedItems)</span>
  </div>
</template>

<script>
import TestApi from '@/assets/dataTableTestApi';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: 'image', value: 'image', sortable: false },
      {
        text: 'Dessert (100g serving)',
        align: 'start',
        // sortable: false,
        value: 'name',
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' },
    ],
    items: [],
    total: null,
    selectedItems: [],
  }),
  mounted() {
    new this.$popup.ProductSelect({
      // propsData: {
      // message: 'this is example message',
      // },
    }).$mount();
  },
  methods: {
    showPopup() {
      new this.$popup.Example({
        propsData: {
          message: 'this is example message',
          okCallback: () => {
            console.log('okCallback');
          },
          cancelCallback: () => {
            console.log('cancelCallback');
          },
        },
        beforeCreate: () => { console.log('beforeCreate'); },
        created: () => { console.log('created'); },
        beforeMount: () => { console.log('beforeMount'); },
        mounted: () => { console.log('mounted'); },
        beforeDestroy: () => { console.log('beforeDestroy'); },
        destroyed: () => { console.log('destroyed'); },
      }).$mount();
    },
    async getData(query) {
      // if you need custom
      // query.page = 99;
      // await this.$router.push({ query });
      this.loading = true;
      const { items, total } = await TestApi.getData(query);
      this.items = items;
      this.total = total;
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    printSelectedItems() {
      this.selectedItems = this.$refs.dataTable.getSelectedItems();
    },
  },
};
</script>
