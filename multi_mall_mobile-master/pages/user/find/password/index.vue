<template>
  <div>
    <Header></Header>
    <v-container>
      <form>
        <div class="login_wrap">
          <div class="login_wrap_title m_t_40"><b>비밀번호 찾기</b></div>
          <div class="tab_nav_wrap">
            <nuxt-link to="/user/find/email">아이디 찾기</nuxt-link>
            <a class="on">비밀번호 찾기</a>
          </div>
          <ul class="m_t_20 m_b_40" v-if="!isChangePassword">
            <li>
              <div class="title">이름</div>
              <div class="body">
                <input type="text" placeholder="가입된 이름을 입력하세요." v-model="userInfo.name">
              </div>
            </li>
            <li>
              <div class="title">아이디(이메일)</div>
              <div class="body">
                <input type="text" placeholder="가입된 이메일을 입력하세요." v-on:input="validateEmail" v-model="userInfo.email">
              </div>
            </li>
            <li>
              <div class="title">전화번호</div>
              <div class="body">
                <div class="input_but_wrap d_ib_100">
                  <input type="number" placeholder="'-'없이 숫자만 입력" v-model="userInfo.phone">
                  <a v-on:click="getVerifyNumber">인증번호 받기</a>
                </div>
              </div>
            </li>
            <li>
              <div class="title">인증번호</div>
              <div class="body">
                  <input type="number" placeholder="인증번호 입력" v-model="userInfo.authNumber">
              </div>
            </li>
          </ul>
          <ul class="m_t_20" v-else>
            <li>
              <div class="title">아이디(이메일)</div>
              <div class="body">
                {{ changeUserInfo.email }}
              </div>
            </li>
            <li>
              <div class="title">새 비밀번호 입력</div>
              <div class="body">
                <input type="password" placeholder="새로운 비밀번호 입력(8자 이상 영문, 특수문자 조합)" v-on:input="validatePassword" v-model="changeUserInfo.newPassword">
              </div>
            </li>
            <li>
              <div class="title">새 비밀번호 확인</div>
              <div class="body">
                <input type="password" placeholder="새로운 비밀번호 확인" v-on:input="validatePassword"  v-model="changeUserInfo.newPasswordConfirm">
              </div>
            </li>
          </ul>
          <div class="font_12 color_r m_t_10 m_b_10" v-if="isChangePassword">{{ changeUserInfo.message }}</div>
          <div class="font_12 color_r m_t_10 m_b_10" v-else>{{ userInfo.message }}</div>
          <div class="but_wrap m_t_40">
            <a class="gray_but w_100" v-on:click="changePassword" v-if="isChangePassword">비밀번호 변경</a>
            <a class="gray_but w_100" v-on:click="findPassword" v-else>비밀번호 찾기</a>
          </div>
        </div>
      </form>

    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/user/find/password/index.js"></script>
