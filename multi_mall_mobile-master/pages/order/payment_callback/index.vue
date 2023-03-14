<template>
  <div>

    <span>주문 처리 중입니다</span><br/>
    <span>잠시만 기다려주세요...</span>

    <loading
      :active="true"
      :can-cancel="true"
      :is-full-page="true"></loading>
  </div>
</template>
<script src="@/assets/javascripts/order/payment_callback/index.js"></script>
