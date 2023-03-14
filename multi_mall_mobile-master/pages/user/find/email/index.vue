<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="login_wrap">
        <div class="login_wrap_title m_t_40"><b>아이디 찾기</b></div>

        <div class="tab_nav_wrap">
          <a class="on">아이디 찾기</a>
          <nuxt-link to="/user/find/password">비밀번호 찾기</nuxt-link>
        </div>
        <ul class="m_t_20 m_b_40" v-if="!isAccount">
          <li class="m_b_20">
            <b>등록된 휴대폰 번호로 찾기</b><br>
            가입 당시 입력한 휴대전화 번호를 통해 아이디를 찾을 수 있습니다.
          </li>
          <li>
            <div class="title">전화번호</div>
            <div class="body">
              <div class="input_but_wrap d_ib_100">
                <input type="number" placeholder="'-'없이 숫자만 입력" v-model="userInfo.send_to"><a v-on:click="getCode">인증번호 받기</a>
              </div>
              <div class="font_12 color_r" v-if="message">{{ message }}</div>
            </div>
          </li>
          <li>
            <div class="title">인증번호</div>
            <div class="body">
              <input type="text" placeholder="인증번호" v-model="userInfo.code">
            </div>
          </li>
        </ul>
        <ul class="m_t_20 m_b_40" v-else>
          <li>
            <div class="title">계정</div>
            <div class="body" v-if="email">회원님의 계정은 <b>{{ email }}</b>입니다.</div>
          </li>
        </ul>

        <div class="but_wrap margin-bottom-last-0">
          <nuxt-link class="gray_but w_100" v-if="email" to="/user/login">로그인</nuxt-link>
          <a class="gray_but w_100" v-on:click="findEmail" v-else>본인 명의 휴대폰 인증</a>
        </div>
        <div class="font_12 color_r" v-if="accountMessage">{{ accountMessage }}</div>

      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/user/find/email/index.js"></script>
