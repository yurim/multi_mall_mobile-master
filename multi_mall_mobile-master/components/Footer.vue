<template>
  <div class="footer_wrap">
    <div class="footer_nav">
      <ul>
        <li>
          <nuxt-link to="/agreement/privacy">개인정보처리방침</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/agreement/terms">이용약관</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="footer_info_wrap">
      <dl class="footer_info">
        <div class="footer_info_item">
          <dt>상담/주문전화</dt>
          <dd>{{ csInfo.phone }}</dd>
        </div>
        <div class="footer_info_item">
          <dt>CS운영시간</dt>
          <dd>{{ csInfo.cs_time }}</dd>
        </div>
      </dl>
      <dl class="footer_info">
        <div class="footer_info_item">
          <dt>회사명</dt>
          <dd>{{ businessInfo.company_name }}</dd>
        </div>
        <div class="footer_info_item">
          <dt>대표이사</dt>
          <dd>{{ businessInfo.ceo_name }}</dd>
        </div>
      </dl>
      <dl class="footer_info">
        <div class="footer_info_item">
          <dt>주소</dt>
          <dd>{{ businessInfo.address }}</dd>
        </div>
      </dl>
      <dl class="footer_info">
        <div class="footer_info_item">
          <dt>전화</dt>
          <dd>{{ businessInfo.phone }}</dd>
        </div>
        <div class="footer_info_item">
          <dt>이메일</dt>
          <dd>{{ businessInfo.email }}</dd>
        </div>
        <div class="footer_info_item" v-if="businessInfo.fax">
          <dt>팩스</dt>
          <dd>{{ businessInfo.fax }}</dd>
        </div>
      </dl>
      <dl class="footer_info">
        <div class="footer_info_item">
          <dt>사업자등록번호</dt>
          <dd>{{ businessInfo.license_num }}</dd>
        </div>
        <div class="footer_info_item">
          <dt>통신판매업신고</dt>
          <dd>{{ businessInfo.sale_num }}
            <a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8418800786"
               target="_blank">[사업자정보확인]
            </a>
          </dd>
        </div>
      </dl>
      <div class="footer_info">
       <div class="footer_info_item">
          (주)13hz는 통신판매중개자로서 "몰리"의 상품은 개별 판매자가 직접 등록하며, 입점판매자가 등록한 상품정보 및 거래에 대해 (주)13hz는 일체 책임을 지지 않습니다.<br>
          해외 사이트에서 상품을 대량 소싱하는 쇼핑몰 특성상 일부 상품이 상표권 및 지적재산권을 침해하게 되는 경우가 발생할 수 있습니다.<br>
          해당사항은 고객센터로 연락주시면 최대한 빠르게 처리해 드리겠습니다.
        </div>
      </div>
      <div class="m_t_10">
        <a onclick="goValidEscrow('im_ilsarmh11S');">
          <img alt="company logo" src="@/assets/img/img_mark01.png" width="150" style="cursor:hand">
        </a>
      </div>
    </div>
    <p>Copyright(c) 2019 market all right reserved.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Footer',
  computed: {
    ...mapGetters({
      businessInfo: 'main/businessInfo',
      csInfo: 'main/csInfo',
    }),
  },
  async created() {
    await this.$store.dispatch('main/getBusinessInfo');
  },
};
</script>
