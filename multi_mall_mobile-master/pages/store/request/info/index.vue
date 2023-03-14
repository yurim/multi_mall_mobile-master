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
        <div class="partner_wrap">
          <div>
            <h3>담당자 정보</h3>
            <ul>
              <li>
                <div class="info_title">이메일 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="email" placeholder="내용을 입력해주세요." v-model="store.account_info.email">
                </div>
              </li>
              <li>
                <div class="info_title">비밀번호 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="password" ref="password" placeholder="내용을 입력해주세요." v-model="store.account_info.password">
                </div>
              </li>
              <li>
                <div class="info_title">비밀번호 확인 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="password" ref="passwordCheck" placeholder="내용을 입력해주세요." v-model="store.account_info.passwordCheck">
                </div>
                <div v-if="!isPasswordConfirm" class="font_12 color_r">비밀번호가 일치하지 않습니다.</div>
              </li>
            </ul>
          </div>
          <div>
            <h3>사업자 정보</h3>
            <ul>
              <li>
                <div class="info_title">사업자 등록증 <span class="color_r">*</span></div>
                <div class="input_textfield_file">
                  <span v-if="preview.license === ''" class="file_txt">파일을 첨부해주세요</span>
                  <img :src="preview.license" v-if="preview.license" />
                  <div class="input_file_wrap m_l_10 w_auto">
                    <input type="file" id="license" v-on:change="fileUpload" ref="business_info_license" accept="image/*">
                    <label for="license">첨부파일 등록</label>
                  </div>
                </div>
              </li>
              <li>
                <div class="info_title">사업자 등록번호 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_license_num" placeholder="내용을 입력해주세요." v-model="store.business_info.license_num">
                </div>
              </li>
              <li>
                <div class="info_title">업체명 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_company_name" placeholder="내용을 입력해주세요." v-model="store.business_info.company_name">
                </div>
              </li>
              <li>
                <div class="info_title">쇼핑몰 이름 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_company_name" placeholder="내용을 입력해주세요." v-model="store.business_info.store_name">
                </div>
              </li>
              <li>
                <div class="info_title">대표 상품군 <span class="color_r">*</span></div>
                <div class="select_half_wrap">
                  <div class="select_half">
                    <select @change="selectedCategories" v-for="(categories, i) in categories_list" :id="i" :key="i">
                      <option value="">선택</option>
                      <option
                        v-for="category in categories"
                        :key="`category_${category._id}`"
                        :value="category._id"
                        :name="category.name"
                      >{{ category.name }}</option>
                    </select>
                  </div>
                  <div class="select_but_wrap"><a v-on:click="addCategoryGroup">추가</a></div>
                </div>
<!--                todo:  css 수정요청-->
                <div class="category_list_wrap w_100" v-if="represent_categories.length > 0">
                  <div class="m_r_10" v-for="(categoryGroup, i) in represent_categories" :key="i">
                    <ul>
                      <li v-for="category in categoryGroup" v-bind:key="category._id">{{ category.name }}</li>
                    </ul>
                    <a v-on:click="deleteCategory(i)">삭제</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="info_title">타겟 연령층 <span class="color_r">*</span></div>
                <div class="input_checkbox">
                  <div class="checkbox_wrap">
                    <template v-for="target in ageTarget">
                      <input type="checkbox" name="targetAge" :id="`${target.value}_${target.key}`" :value="target.key" :key="target.value" @click="setTarget">
                      <label :for="`${target.value}_${target.key}`" :key="target.key">{{ target.value }}</label>
                    </template>
                  </div>
                </div>
              </li>
              <li>
                <div class="info_title">카카오톡 플러스 친구 링크</div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_phone" placeholder="내용을 입력해주세요." v-model="store.kakao_plus_url">
                </div>
              </li>
              <li>
                <div class="info_title">인스타그램 아이디</div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_phone" placeholder="내용을 입력해주세요." v-model="store.instagram_id">
                </div>
              </li>
              <li>
                <div class="info_title">대표전화 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_phone" placeholder="내용을 입력해주세요." v-model="store.business_info.phone">
                </div>
              </li>
              <li>
                <div class="info_title">대표자 성명 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_ceo_name" placeholder="내용을 입력해주세요." v-model="store.business_info.ceo_name">
                </div>
              </li>
              <li>
                <div class="info_title">대표 이메일 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_email" placeholder="내용을 입력해주세요." v-model="store.business_info.email">
                </div>
              </li>
              <li>
                <div class="info_title">통신판매업 신고번호 <span class="color_r">*</span></div>
                <div class="input_textfield_file">
                  <span class="file_txt" v-if="preview.sale === ''">파일을 첨부해주세요</span>
                  <img :src="preview.sale" v-if="preview.sale" />
                  <div class="input_file_wrap m_l_10 w_auto">
                    <input type="file" id="sale" ref="business_info_mail_order_report_num" v-on:change="fileUpload" accept="image/*">
                    <label for="sale">첨부파일 등록</label>
                  </div>
                </div>
              </li>
              <li>
                <div class="info_title">통신판매업 신고번호 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_license_num" placeholder="내용을 입력해주세요." v-model="store.business_info.sale_num">
                </div>
              </li>
              <li>
                <div class="info_title">업태 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_status" placeholder="내용을 입력해주세요." v-model="store.business_info.status">
                </div>
              </li>
              <li>
                <div class="info_title">종목 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="business_info_item" placeholder="내용을 입력해주세요." v-model="store.business_info.item">
                </div>
              </li>
              <li>
                <div class="info_title">사업장 주소 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <div class="address_wrap">
                    <input type="text" placeholder="우편번호" ref="business_info_zipcode" readonly v-on:click="postCode('postcodeWrap')" v-model="store.business_info.zipcode">
                    <a class="btn_small" v-on:click="postCode('postcodeWrap')">우편번호</a>
                    <!-- *** daum postcode iframe START *** -->
                    <div id="postcodeWrap" class="postcode_wrap">
                      <span id="btnFoldWrap" class="postcode_close_btn" @click="closeSearchAddress('postcodeWrap')"></span>
                    </div>
                    <!-- *** daum postcode iframe END *** -->
                    <input type="text" placeholder="주소" ref="business_info_address" v-model="store.business_info.address">
                    <input type="text" placeholder="상세주소" v-model="store.business_info.detail_address">
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <div>
              <h3 class="chk_name">담당자 입력</h3>
              <div class="checkbox_wrap">
                <input type="checkbox" id="isCopy" v-on:click="copyBusinessInfo">
                <label for="isCopy">대표자와 동일</label>
              </div>
            </div>
            <ul>
              <li>
                <div class="info_title">이름 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="admin_name" placeholder="내용을 입력해주세요." v-model="store.admin.name">
                </div>
              </li>
              <li>
                <div class="info_title">휴대폰번호 <span class="color_r">*</span></div>
                <div class="input_textfield">
                  <input type="text" ref="admin_phone" placeholder="내용을 입력해주세요." v-model="store.admin.phone">
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3>판매 채널</h3>
            <div class="radio_box">
              <div class="radio_wrap">
                <template v-for="code in storeTypes" v-if="code.key !== 'ABROAD'">
                  <input
                    type="radio"
                    name="store_type"
                    @change="changedStoreType($event)"
                    :id="code.key"
                    :value="code.key"
                    v-model="store.store_type"
                  >
                  <label :for="code.key">{{code.value}}</label>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="but_wrap">
          <a v-on:click="enterCancel" class="line_but">취소</a>
          <a v-on:click="enterRequest">입점 신청</a>
        </div>
      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>
<script src="@/assets/javascripts/store/request/info/index.js"></script>
