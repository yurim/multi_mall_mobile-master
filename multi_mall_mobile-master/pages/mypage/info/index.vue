<template>
  <div>
    <Header></Header>
    <v-container>
      <div class="mypage_info_wrap">
        <div class="main_title_wrap">
          <h2>마이페이지</h2>
        </div>

        <!-- *** 마이페이지 현황 START *** -->
        <MypageCondition></MypageCondition>
        <!-- *** 마이페이지 현황 END *** -->

        <!-- *** 마이페이지 탭 메뉴 START *** -->
        <TopTabNav></TopTabNav>
        <!-- *** 마이페이지 탭 메뉴 END *** -->

        <!-- *** 비밀번호 인증 START *** -->
        <div class="mypage_info_inner" v-if="!isVerifyPassword">
          <h3>내정보</h3>
          <div class="info_title m_t_10">비밀번호</div>
          <div class="input_textfield">
            <input type="password" class="w_100" name="password" id="password" v-model="password" v-on:keyup.enter="myInfoAuth" placeholder="비밀번호를 입력해주세요.">
          </div>
          <div class="font_12 color_r" v-if="message">{{ message }}</div>
          <div class="but_wrap">
            <a  v-on:click="myInfoAuth">확인</a>
          </div>
        </div>
        <!-- *** 비밀번호 인증 END *** -->

        <!-- *** 회원정보 수정 START *** -->
        <div class="mypage_modify" v-if="isVerifyPassword">
          <h3>회원 정보 수정</h3>
          <ul>
            <li>
              <div class="info_title">아이디(이메일) : {{ userInfo.email }}</div>
            </li>
            <li>
              <div class="info_title">이름 : {{ userInfo.name }}</div>
            </li>
            <li>
              <div class="info_title">휴대폰번호</div>
              <div class="info_txt">{{ userInfo.phone | contact }}</div>
              <div class="btn_s_right">
                <a class="line_but" @click="phoneChange">번호 수정</a>
              </div>
              <!-- *** 번호 수정 START *** -->
              <div class="input_textfield" v-if="isChange">
                <div class="address_wrap">
                  <input type="text" placeholder="'-'없이 숫자만 입력" v-model="contact.value">
                  <a class="but_light" @click="getAuthNumber">인증번호 받기</a>
                </div>
                <div class="address_wrap">
                  <input type="text" placeholder="인증번호" v-model="contact.authNumber">
                  <a class="but_light" @click="changePhoneNumber">인증하기</a>
                  <div class="font_12 color_r" v-if="contact.message">{{ contact.message }}</div>
                </div>
              </div>
              <!-- *** 번호 수정 END *** -->
            </li>
          </ul>
          <span v-if="!isSNSUser">비밀번호 변경</span>
          <ul>
            <template v-if="!isSNSUser">
              <!-- *** 비밀번호 수정 START *** -->
              <li>
                <div class="info_title">현재 비밀번호</div>
                <div class="input_textfield">
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.current">
                </div>
              </li>
              <li>
                <div class="info_title">신규 비밀번호</div>
                <div class="input_textfield">
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.new" v-on:input="passwordCheck">
                </div>
              </li>
              <li>
                <div class="info_title">비밀번호 재입력</div>
                <div class="input_textfield">
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.newCheck" v-on:input="passwordCheck">
                </div>
                <div class="font_12 color_r" v-if="passwords.message">{{ passwords.message }}</div>
              </li>
              <!-- *** 비밀번호 수정 END *** -->
            </template>
            <li>
              <div class="info_txt">배송지 변경</div>
              <div class="btn_s_right">
                <a class="line_but" v-on:click="popDeliveryList">배송지 목록</a>
              </div>
            </li>
            <li>
              <div class="info_title">정보 수신 동의</div>
              <div class="input_checkbox">
                <div class="checkbox_wrap">
                  <input type="checkbox" id="type_total" v-model="allCheck">
                  <label for="type_total">홍보성 정보 수신에 전체 동의 합니다.</label>
                </div>
                <div class="checkbox_wrap" v-for="(type, i) in receptionTypeList" :key="`reception_${i}`">
                  <input type="checkbox" :id="`type_${type.key}`" :value="type.key" v-model="user_reception" @change="changeReception">
                  <label :for="`type_${type.key}`">{{ type.value }}</label>
                </div>
              </div>
            </li>
          </ul>
          <div class="but_wrap">
            <a class="red_line_but" v-on:click="popLeave">회원탈퇴</a>
            <button v-on:click="patchUserInfo" :disabled="changeDisabled === false" :class="changeDisabled === false ? 'disabled_but' : ''">변경</button>
          </div>
        </div>
        <!-- *** 회원정보 수정 END *** -->
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/mypage/info/index.js"></script>
