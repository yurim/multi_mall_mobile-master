<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div class="login_wrap">
        <div class="login_wrap_title m_t_40"><b>회원가입</b></div>

        <ul class="m_t_20">
          <li>
            <div>{{ userInfo.email.text }}</div>
            <input type="text" placeholder="이메일를 입력해주세요." id="email" name="email" v-on:input="validationCheck" v-model="userInfo.email.value" readonly>
            <div class="font_12 color_r" v-if="userInfo.email.message">{{ userInfo.email.message }}</div>
          </li>
          <li>
            <div>{{ userInfo.name.text }}</div>
            <input type="text" placeholder="이름" id="name" name="name" v-on:input="validationCheck" v-model="userInfo.name.value" readonly>
            <div class="font_12 color_r" v-if="userInfo.name.message">{{ userInfo.name.message }}</div>
          </li>
          <li>
            <div>{{ userInfo.phone.text }}</div>
            <div class="input_but_wrap d_ib_100">
              <input type="text" placeholder="'-'없이 숫자만 입력" id="phone" name="phone" v-on:input="validationCheck" v-model="userInfo.phone.value">
              <a @click="sendSMSAuth">인증번호 받기</a>
            </div>
            <div class="font_12 color_r" v-if="userInfo.phone.message">{{ userInfo.phone.message }}</div>
            <div class="input_but_wrap d_ib_100">
              <input type="text" placeholder="인증번호" id="authNumber" name="authNumber" v-on:input="validationCheck" v-model="userInfo.authNumber.value">
              <a @click="verifySMSAuth">인증하기</a>
            </div>
            <div class="font_12 color_r" v-if="userInfo.authNumber.message">{{ userInfo.authNumber.message }}</div>
          </li>
          <li>
            <div class="m_b_10" v-for="(agreement, i) in agreements" :key="i">
              <div class="w_auto checkbox_wrap">
                <input type="checkbox" :id="agreement.value" :value="agreement.value" v-model="checked">
                <label :for="agreement.value">{{ agreement.text }}</label>
              </div>
              <a :id="i" class="pull-right" v-on:click="showTerms">약관보기</a>
            </div>
            <div class="m_b_10">
              <div class="w_auto checkbox_wrap">
                <input type="checkbox" id="agreementAll" v-model="allCheck">
                <label for="agreementAll">약관 전체 동의</label>
              </div>
            </div>
            <div class="font_12 color_r" v-if="agreementMessage">{{ agreementMessage }}</div>
          </li>
        </ul>

        <div class="but_wrap">
          <a class="gray_but w_100" v-on:click.prevent="createSNSUserInfo">가입하기</a>
        </div>
      </div>

  </v-container>
  <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/user/regist/sns/index.js"></script>
