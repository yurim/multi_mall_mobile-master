<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div>
            <span>message</span>
            <input type="text" placeholder="입력" v-model="params.inputText"/>
          </div>

          <div>
            <button @click="ok">OK</button>
            <button @click="cancel">CANCEL</button>
          </div>

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
  methods: {
  },
});
/*
    * Uasge *

    new this.$popup.Example({
        propsData: {
            message: 'this is example message',admin/store_management_show
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
 */
</script>
