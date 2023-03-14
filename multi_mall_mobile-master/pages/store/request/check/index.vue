<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="content_warp">
        <div class="main_title_wrap">
          <h2>판매자 입점 신청</h2>
        </div>
        <div class="register_terms">
          <p>※ 작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</p>
          <p>※ 입점 불가에 대한 통보는 불가 사유와 함께 이메일로 보내드립니다.</p>
          <p>※ 회신을 주셔도 답변이 불가한 점 양해 부탁드립니다.</p>
          <p>※ 사업자가 이미 등록되어 있어 입점 신청이 불가한 경우 help@13hz.kr으로 이메일을 보내주세요.</p>
          <p>※ 입점 신청과 관련된 내용은 일반 고객센터 접수가 불가능합니다.</p>
        </div>
        <div class="register_checkbox">
          <ul>
            <li>
              <!--  todo:  all_chk 클릭시 checkbox 모두선택, 모두해제  -->
              <div class="checkbox_wrap">
                <input type="checkbox" id="agreementAll" v-model="allCheck">
                <label for="agreementAll">약관 전체 동의</label>
              </div>
            </li>
            <li>
              <div class="checkbox_wrap">
                <input type="checkbox" id="services" v-model="services">
                <label for="services">이용 약관에 동의</label>
              </div>
              <div class="square_but_wrap pull-right">
                <a class="gray_but_light" href="javascript:;">자세히 보기</a>
              </div>
            </li>
            <li>
              <div class="checkbox_wrap">
                <input type="checkbox" id="privacy" v-model="privacy">
                <label for="privacy">개인정보 수집 및 이용 동의</label>
              </div>
              <div class="square_but_wrap pull-right">
                <a class="gray_but_light" href="javascript:;">자세히 보기</a>
              </div>
            </li>
            <li>
              <div class="checkbox_wrap">
                <input type="checkbox" id="third" v-model="third">
                <label for="third">제 3자 정보 제공에 동의</label>
              </div>
              <div class="square_but_wrap pull-right">
                <a class="gray_but_light" href="javascript:;">자세히 보기</a>
              </div>
            </li>
          </ul>
        </div>
        <div class="but_wrap">
          <a v-on:click="historyBack" class="line_but">이전</a>
          <a v-on:click="historyNext">다음</a>
        </div>
        <div class="font_12 color_r text-center m_t_10">{{ message }}</div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/store/request/check/index.js"></script>
