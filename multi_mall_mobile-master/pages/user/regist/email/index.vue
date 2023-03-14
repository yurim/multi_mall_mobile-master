<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="login_wrap">
        <div class="login_wrap_title m_t_40"><b>JOIN</b></div>

        <ul class="m_t_20">
          <li>
            <div class="title">{{ userInfo.email.text }}</div>
            <input type="text" placeholder="이메일를 입력해주세요." id="email" name="email" v-on:input="validationCheck" v-model="userInfo.email.value">
            <div class="font_12 color_r" v-if="userInfo.email.message">{{ userInfo.email.message }}</div>
          </li>
          <li>
            <div class="title">{{ userInfo.password.text }}</div>
            <input type="password" placeholder="비밀번호 (8자 이상의 영문, 숫자, 특수문자 조합)" id="password" name="password" class="m_b_10" v-model="userInfo.password.value" :minlength="8">
            <input type="password" placeholder="비밀번호 확인" id="passwordConfirm" v-model="passwordConfirm" v-on:input="validationCheck" :minlength="8">
            <div class="font_12 color_r" v-if="userInfo.password.message">{{ userInfo.password.message }}</div>
          </li>
          <li>
            <div class="title">{{ userInfo.name.text }}</div>
            <input type="text" placeholder="이름" id="name" name="name" v-on:input="validationCheck" v-model="userInfo.name.value">
            <div class="font_12 color_r" v-if="userInfo.name.message">{{ userInfo.name.message }}</div>
          </li>
          <li>
            <div class="title">{{ userInfo.phone.text }}</div>
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
              <div class="square_but_wrap pull-right">
                <a class="gray_but_light" :id="i" v-on:click="popTerms(agreement.text, agreement.value)">자세히 보기</a>
              </div>
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
          <a class="gray_but w_100" v-on:click.prevent="createUserInfo">가입하기</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/user/regist/email/index.js"></script>
