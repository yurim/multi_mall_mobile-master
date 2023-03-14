<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div class="login_wrap">
        <div class="login_wrap_title m_t_40"><b>JOIN</b></div>
        <ul class="but_wrap">
          <li><nuxt-link class="w_100" to="/user/regist/email">이메일 회원가입</nuxt-link></li>
          <!--          TODO: 네이버 로그인 모바일용 화면 ? -->
          <li><a class="naver_but w_100" id="naverIdLogin_loginButton">네이버 가입하기</a></li>
<!--          <li><a class="kakao_but w_100">카카오톡 가입하기</a></li>-->
        </ul>
      </div>

  </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/user/regist/index.js"></script>
