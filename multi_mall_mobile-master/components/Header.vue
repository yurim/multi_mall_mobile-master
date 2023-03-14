<template>
  <div>
    <div class="mobile_header_wrap">
      <div class="position_r">
        <div class="header_bar_btn" @click="sideOn = !sideOn" v-on:click="setMenuVisible">
          <button class="bar_icon">메뉴열기</button>
        </div>
        <h1 class="mobile_logo">
          <nuxt-link to="/main">molly</nuxt-link>
        </h1>
<!--        <div class="header_bar_right">-->
<!--          <div class="mobile_search" @click="setSearch">-->
<!--            <a href="javascript:">검색</a>-->
<!--          </div>-->
<!--          &lt;!&ndash;  나중에 들어갈 예정&ndash;&gt;-->
<!--          &lt;!&ndash;  <div class="mobile_cart">&ndash;&gt;-->
<!--          &lt;!&ndash;   <nuxt-link to="/cart"><em>0</em></nuxt-link>&ndash;&gt;-->
<!--          &lt;!&ndash;  </div>&ndash;&gt;-->
<!--        </div>-->
      </div>
      <div class="search_bar_wrap">
        <a href="javascript:" @click="setSearch">
          오늘은 <span class="main_c_b">'{{ placeholderKeyword }}'</span>를 검색해볼까요?
          <span class="icon"></span>
        </a>
      </div>
    </div>
    <div class="br_mobile_search_wrap" :class="{on: searchOn}">
      <v-container>
        <div class="brand_head">
          <nuxt-link class="mobile_logo" to="/main">molly</nuxt-link>
          <button class="close_btn" @click="searchOn = !searchOn"></button>
        </div>
        <div class="search_top">
          <input type="text" autocomplete="off" placeholder="검색어를 입력해 주세요." v-model="keyword"
                 v-on:keypress.enter="search"/>
          <button v-on:click="search" class="mobile_search"></button>
        </div>
      </v-container>
      <div class="search_inner">
        <div class="search_history_header">최근 검색어</div>
        <div class="search_history_empty" v-if="keywords.length === 0">최근 검색한 내역이 없습니다.</div>
        <ul class="search_history_list" v-if="keywords.length > 0">
          <li v-for="(keyword, i) in keywords" :key="i">
            <a class="keyword" :id="`${keyword.q}_${i}`" v-on:click="searchKeyword">{{ keyword.q }}</a>
            <a class="close_btn" v-on:click="deleteKeyword" :id="`deleteIcon_${i}`"></a>
          </li>
        </ul>

        <div class="search_history_header m_t_10">인기 검색어</div>
        <div class="popularity_keywords_wrap p_b_10">
          <ul>
            <li v-for="(keyword, i) in popularityKeywords" :key="i">
              <b :class="i <= 2 ? 'main_c_b':''">{{i + 1}}. </b>
              <a :id="`${keyword}_${i}`" v-on:click="searchKeyword">{{keyword}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="search_img_wrap">
        <div class="search_btn" @click="uploadImage">
          <span class="image_search_icon"></span>
        </div>
        <div class="text">가격비교 상품 이미지로 검색하기!</div>
      </div>
    </div>

    <div class="gnb" :class="{on: sideOn}">
      <div class="gnb_top">
        <div class="brand_head">
          <nuxt-link class="mobile_logo" to="/main">molly</nuxt-link>
          <a class="close_btn" @click="sideOn = !sideOn">닫기</a>
        </div>
        <div class="but_wrap" v-if="!isUserLogin">
          <nuxt-link to="/user/regist" class="line_but">회원가입</nuxt-link>
          <nuxt-link to="/user/login">로그인</nuxt-link>
        </div>
        <div class="info_wrap" v-else>
          <div class="nickname">{{userAccount}}</div>
          <div class="btn_s_right" v-if="isUserLogin">
            <nuxt-link to="/mypage/info" class="line_but">내정보</nuxt-link>
            <a class="red_line_but" v-on:click="logout">로그아웃</a>
          </div>
        </div>
      </div>

      <div class="gnb_inner" :class="{one_open: dept1Open, two_open: dept2Open, three_open: dept3Open, four_open: dept4Open}">
        <ul class="depth_one">
          <li>
            <span class="depth_title">MOLLY MENU</span>
          </li>
          <li>
            <nuxt-link to="/store">STORE</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/store/42">리퍼샵</nuxt-link>
          </li>
          <li class="m_b_10">
            <nuxt-link to="/price_group" @click.native="sideOn = !sideOn">가격비교</nuxt-link>
          </li>
          <li class="depth_title_line">
            <span>MOLLY CATEGORY</span>
          </li>
          <li
            v-for="(menu, idx) in oneDepthMenu"
            :key="`one_depth_${idx}`"
            v-on:click="setMenuByLevel(menu, 2)"
            :style="menu.id === menuPath[0] ? 'color: #4A6EEF' : ''"
          ><a
          >{{ menu.name }}</a>
          </li>
        </ul>
        <ul class="depth_two">
          <li>
            <div class="head_wrap">
              <a class="back" @click="dept1Open = true; dept2Open = false; dept3Open = false; dept4Open = false;"><i class="icon_arrow_left"></i><em>{{ this.dept1Title }}</em></a>
              <a class="all_category" v-on:click="pageToCategory(menuPath[0])">전체보기</a>
            </div>
          </li>
          <li
            v-for="(menu, idx) in twoDepthMenu"
            :key="`two_depth_${idx}`"
            v-on:click="setMenuByLevel(menu, 3)"
            :style="menu.id === menuPath[1] ? 'color: #4A6EEF' : ''"
          ><a>{{ menu.name }}</a>
          </li>
        </ul>
        <ul class="depth_three">
          <li>
            <div class="head_wrap">
              <a class="back" @click="dept1Open = false; dept2Open = true; dept3Open = false; dept4Open = false;"><i class="icon_arrow_left"></i><em>{{ this.dept2Title }}</em></a>
              <a class="all_category" v-on:click="pageToCategory(menuPath[1])">전체보기</a>
            </div>
          </li>

          <li
            v-for="(menu, idx) in threeDepthMenu"
            :key="`three_depth_${idx}`"
            v-on:click="setMenuByLevel(menu, 4)"
            :style="menu.id === menuPath[2] ? 'color: #4A6EEF' : ''"
          ><a>{{ menu.name }}</a>
          </li>
        </ul>
        <ul class="depth_four">
          <li>
            <div class="head_wrap">
              <a class="back" @click="dept1Open = false; dept2Open = false; dept3Open = true; dept4Open = false;"><i class="icon_arrow_left"></i><em>{{ this.dept3Title }}</em></a>
              <a class="all_category" v-on:click="pageToCategory(menuPath[2])">전체보기</a>
            </div>
          </li>
          <li
            v-for="(menu, idx) in fourDepthMenu"
            :key="`fourth_depth_${idx}`"
            v-on:click="pageToCategory(menu.id)"
            :style="menu.id === menuPath[3] ? 'color: #4A6EEF' : ''"
          ><a>{{ menu.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '@/plugins/utils';
import moment from 'moment-timezone';
import _ from 'lodash';
import Popup from '@/components/popups/popup';

moment.tz.setDefault('Asia/Seoul');
const JWT = 'jwt';
const LOGIN_TARGET = 'lgn_tgt';

export default {
  name: 'Header',
  data: () => ({
    isUserLogin: false,
    userAccount: '',
    keyword: '',
    keywords: [],
    searchOn: false,
    sideOn: false,
    dept1Open: true,
    dept2Open: false,
    dept3Open: false,
    dept4Open: false,
    menuPath: ['', '', '', ''],

    dept1Title: '',
    dept2Title: '',
    dept3Title: '',

    categories: [],
    oneDepthMenu: [],
    twoDepthMenu: [],
    threeDepthMenu: [],
    fourDepthMenu: [],
    bodyTag: null,

    popularityKeywords: [
      '트위드자켓', '원피스', '나이키운동화', '탈모샴푸', '가습기', '공기청정기', '헹거', '게이밍의자', '포켓몬카드', '비타민',
    ],
    placeholderKeyword: '',
  }),
  beforeMount() {
    this.checkLogin();
  },
  mounted() {
    this.bodyTag = document.getElementById('body');
    this.randomKeyword();
  },
  activated() {
    this.init();
    this.checkLogin();
    this.sideOn = false;
    this.searchOn = false;
  },
  deactivated() {
    if (!this.bodyTag) this.bodyTag = document.getElementById('body');
    this.bodyTag.classList.remove('sc_hidden');
  },
  watch: {
    searchOn(newValue) {
      this.setScrollClass(newValue);
    },
    sideOn(newValue) {
      this.setScrollClass(newValue);
    },
  },
  methods: {
    // init
    init() {
      const query = { ...this.$route.query };
      if (query.q) this.keyword = query.q;
      else this.keyword = '';
    },
    setScrollClass(isAdd) {
      if (!this.bodyTag) this.bodyTag = document.getElementById('body');
      if (isAdd) this.bodyTag.classList.add('sc_hidden');
      else this.bodyTag.classList.remove('sc_hidden');
    },
    checkLogin() {
      const jwt = Utils.getCookie(document.cookie, JWT);
      if (jwt) {
        const userInfo = JSON.parse(atob(jwt.split('.')[1]));
        const userGrade = userInfo.info.split('_')[1];
        if (userGrade === '0') this.isUserLogin = true;
      } else {
        this.isUserLogin = false;
      }
      if (this.isUserLogin) {
        this.$store.dispatch('cart/get_carts');
        this.getUserAccount();
      }
    },
    initMenu(menu, level) {
      switch (level) {
        case 2:
          this.menuPath = [menu.id, '', '', ''];
          this.dept1Title = menu.name;
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
          break;
        case 3:
          this.menuPath = [this.menuPath[0], menu.id, '', ''];
          this.dept2Title = menu.name;
          this.fourDepthMenu = [];
          break;
        case 4:
          this.menuPath = [this.menuPath[0], this.menuPath[1], menu.id, ''];
          this.dept3Title = menu.name;
          break;
        default:
          this.menuPath = [menu.id, '', '', ''];
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
      }
    },
    async setMenuVisible() {
      if (this.oneDepthMenu.length === 0) {
        const res = await this.$axios.get('user/category/path ', { path: null, level: 1 });
        this.oneDepthMenu = res.data.data.categories;
        this.categories = res.data.data.categories;
      }
      this.isVisible = !this.isVisible;
    },
    async setMenuByLevel(menu, level) {
      if (!this.isCategoryRetrieve) {
        this.isCategoryRetrieve = true;
        // menu 데이터 셋팅
        if (level < 5) {
          // menu 초기화
          this.initMenu(menu, level);
          // search category in memory
          const category = this.findCategoryByLevel(level, 2, this.categories);
          if (category && (!category.children || category.children.length < 1)) {
            const res = await this.$axios.get(`user/category/path?path=${this.menuPath.filter((n) => n).join(',')}&level=${level}`);
            category.children = res.data.data.categories;
          }
          if (category.children.length === 0) {
            // 하위 카테고리 없음 - 카테고리 상품 페이지로 이동
            this.pageToCategory(category.id);
          } else { // todo 점검
            switch (level) {
              case 2:
                this.dept1Open = false; this.dept2Open = true; this.dept3Open = false; this.dept4Open = false;
                break;
              case 3:
                this.dept1Open = false; this.dept2Open = false; this.dept3Open = true; this.dept4Open = false;
                break;
              case 4:
                this.dept1Open = false; this.dept2Open = false; this.dept3Open = false; this.dept4Open = true;
                break;
              default:
                this.dept1Open = true; this.dept2Open = false; this.dept3Open = false; this.dept4Open = false;
            }
          }
          this.setMenu({
            level: level + 1,
            categories: category ? category.children : [],
          });
        }
        this.isCategoryRetrieve = false;
      }
    },
    setMenu(data) {
      switch (data.level) {
        case 3:
          this.twoDepthMenu = data.categories;
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
          break;
        case 4:
          this.threeDepthMenu = data.categories;
          this.fourDepthMenu = [];
          break;
        case 5:
          this.fourDepthMenu = data.categories;
          break;
        default:
          this.twoDepthMenu = data.categories;
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
      }
    },
    // recursive하게 category 조회
    findCategoryByLevel(targetLevel, level = null, targetCategories = []) {
      if (targetCategories && targetCategories.length > 0) {
        const menuPath = this.menuPath.filter((n) => n);
        const category = _.find(targetCategories, (tc) => tc.id === menuPath[level - 2]);
        if (category) {
          if (targetLevel === level) {
            return category;
          }
          return this.findCategoryByLevel(targetLevel, level + 1, category.children);
        }
        return null;
      }
      return null;
    },
    setSearch() {
      this.searchOn = !this.searchOn;
      const keywordList = Utils.getCookie(document.cookie, 'q');
      if (keywordList) this.keywords = JSON.parse(keywordList);
    },
    searchKeyword(e) {
      const id = e.target.id;
      const idx = id.split('_')[1];
      const now = moment().format();

      console.log(id);
      this.keyword = id.split('_')[0];
      this.keywords.splice(idx, 1);
      this.keywords.unshift({ q: this.keyword, day: now });

      Utils.addCookie('q', JSON.stringify(this.keywords));

      this.getProducts();
      this.searchOn = false;
    },
    deleteKeyword(e) {
      const idx = e.target.id.split('_')[1];
      this.keywords.splice(idx, 1);
      Utils.addCookie('q', JSON.stringify(this.keywords));
    },
    search() {
      const keyword = this.keyword;
      if (keyword) {
        const isSameKeyword = Array.prototype.find.call(this.keywords, (key) => key.q === keyword);
        if (!isSameKeyword) {
          const now = moment().format();
          this.keywords.push({ q: this.keyword, day: now });
          Utils.addCookie('q', JSON.stringify(this.keywords));
        }
        this.getProducts();
      }
      this.searchOn = false;
    },
    async getProducts() {
      const query = { q: this.keyword };
      const currentPath = this.$router.currentRoute.name;

      if (currentPath === 'price_group') {
        this.$router.push({ query });
      } else {
        this.$router.push({ name: 'price_group', query });
      }
    },
    async pageToCategory(categoryId) {
      await this.$router.push({ name: 'price_group', query: { cate: categoryId } });
      this.sideOn = false;
    },
    logout() {
      if (this.isUserLogin) Utils.removeCookie(JWT);
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.indexOf('main') > -1) this.$router.go(0);
      else this.$router.push({ name: 'main' });
      if (this.isUserLogin) {
        Utils.removeCookie(JWT);
        Utils.removeCookie(LOGIN_TARGET);
      }
    },

    async getUserAccount() {
      const res = await this.$axios.get('mypage/info/get_user_account');
      if (res.data.result) {
        this.userAccount = res.data.data.account;
      }
    },
    async uploadImage() {
      new Popup.PriceGroupImageSearch({
        propsData: {
          okCallback: async (params) => {
            const imageFile = params.uploadFile;
            const categoryId = params.lastCategoryId;
            if (this.$router.currentRoute.name === 'price_group-search') {
              // 같은 path에서 params 데이터 수정하여 페이지 이동하기 위해서, query _r을 랜덤으로 줌
              await this.$router.replace({ query: { _r: `${new Date().getTime()}` }, params: { file: imageFile, categoryId } });
            } else {
              await this.$router.push({ name: 'price_group-search', params: { file: imageFile, categoryId } });
            }
            this.searchOn = false;
            params.$destroy();
          },
        },
      }).$mount();
    },
    randomKeyword() {
      const randomIndex = Math.floor(Math.random() * 10);
      this.placeholderKeyword = '';
      this.placeholderKeyword = this.popularityKeywords[randomIndex];
    },
  },
};
</script>
