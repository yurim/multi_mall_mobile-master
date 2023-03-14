<template>
  <v-container>

    <!--    <v-container>-->
    <!--      <div class="section_01 m_t_40">-->
    <!--        <div class="inner">-->
    <!--          <h2 class="sec_main_title star">MOLLY만의 특별한 기획전!</h2>-->
    <!--          <div class="exhibition_list_wrap">-->
    <!--            <ul class="exhibition_list">-->
    <!--              <li>-->
    <!--                <nuxt-link to="/store/37">-->
    <!--                  <div class="exhibition_img">-->
    <!--                    <img src="@/assets/img/exhibition/exhibition_m_03.png" alt="기획전 페이지로 가기">-->
    <!--                  </div>-->
    <!--                  <div class="exhibition_box">-->
    <!--                    <div class="sub_title">여성의류 기획전</div>-->
    <!--                    <div class="kword_wrap">-->
    <!--                      <ul class="kword_list">-->
    <!--                        <li>#원피스</li>-->
    <!--                        <li>#가을패션</li>-->
    <!--                      </ul>-->
    <!--                    </div>-->
    <!--                    <span class="more small">보러가기</span>-->
    <!--                  </div>-->
    <!--                </nuxt-link>-->
    <!--              </li>-->
    <!--              <li>-->
    <!--                <nuxt-link to="/product/category?cate=610a479f5f64f2df12e3f443">-->
    <!--                  <div class="exhibition_img">-->
    <!--                    <img src="@/assets/img/exhibition/exhibition_m_04.png" alt="기획전 페이지로 가기">-->
    <!--                  </div>-->
    <!--                  <div class="exhibition_box">-->
    <!--                    <div class="sub_title">생활/건강</div>-->
    <!--                    <div class="kword_wrap">-->
    <!--                      <ul class="kword_list">-->
    <!--                        <li>#건강관리</li>-->
    <!--                        <li>#위생</li>-->
    <!--                        <li>#생활용품</li>-->
    <!--                      </ul>-->
    <!--                    </div>-->
    <!--                    <span class="more small">보러가기</span>-->
    <!--                  </div>-->
    <!--                </nuxt-link>-->
    <!--              </li>-->
    <!--              <li>-->
    <!--                <nuxt-link to="/store/33">-->
    <!--                  <div class="exhibition_img">-->
    <!--                    <img src="@/assets/img/exhibition/exhibition_m_05.png" alt="기획전 페이지로 가기">-->
    <!--                  </div>-->
    <!--                  <div class="exhibition_box">-->
    <!--                    <div class="sub_title">Apple 상품기획전</div>-->
    <!--                    <div class="kword_wrap">-->
    <!--                      <ul class="kword_list">-->
    <!--                        <li>#아이폰케이스</li>-->
    <!--                        <li>#에어팟케이스</li>-->
    <!--                      </ul>-->
    <!--                    </div>-->
    <!--                    <span class="more small">보러가기</span>-->
    <!--                  </div>-->
    <!--                </nuxt-link>-->
    <!--              </li>-->
    <!--              <li>-->
    <!--                <nuxt-link to="/product/category?cate=610a47ae5f64f2df12e3f5db">-->
    <!--                  <div class="exhibition_img">-->
    <!--                    <img src="@/assets/img/exhibition/exhibition_m_06.png" alt="기획전 페이지로 가기">-->
    <!--                  </div>-->
    <!--                  <div class="exhibition_box">-->
    <!--                    <div class="sub_title">반려동물</div>-->
    <!--                    <div class="kword_wrap">-->
    <!--                      <ul class="kword_list">-->
    <!--                        <li>#강아지</li>-->
    <!--                        <li>#고양이</li>-->
    <!--                        <li>#반려동물</li>-->
    <!--                      </ul>-->
    <!--                    </div>-->
    <!--                    <span class="more small">보러가기</span>-->
    <!--                  </div>-->
    <!--                </nuxt-link>-->
    <!--              </li>-->
    <!--            </ul>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </v-container>-->

    <div>
      <div class="content_01 m_t_40">
        <div class="inner">
          <h2 class="sec_main_title star">MOLLY의 추천 상품!</h2>
          <article>
            <div class="main_article_01">
              <ul class="promotion_slide_list">
                <swiper :options="mainArticle">
                  <template v-for="slide in event_content_01">
                    <swiper-slide>
                      <li>
                        <ul class="prd_info">
                          <template v-for="item in slide">
                            <template v-if="item.inSite">
                              <li v-if="item.banner">
                                <nuxt-link class="promotion_banner" :to="item.link">
                                  <div class="promotion_wrap">
                                    <div class="promotion_title" v-html="item.eventTitle"></div>
                                    <div class="promotion_description">{{ item.eventExplain }}</div>
                                  </div>
                                  <div class="banner_img">
                                    <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                  </div>
                                </nuxt-link>
                              </li>
                              <li v-else>
                                <nuxt-link :to="item.link">
                                  <div class="bottom_item best">
                                    <div class="img_wrap">
                                      <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                    </div>
                                    <div class="category_info">
                                      <div class="category_title">{{ item.productName }}</div>
                                      <div class="category_price">
                                        <span class="discount_percentage">{{ item.percent }}</span>
                                        <div class="price">
                                          <!--                                            <div class="base_price">410,900원</div>-->
                                          <div class="sale_price">{{ item.discountPrice }}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </nuxt-link>
                              </li>
                            </template>
                            <template v-else>
                              <li v-if="item.banner">
                                <a class="promotion_banner" :href="item.link">
                                  <div class="promotion_wrap">
                                    <div class="promotion_title">{{ item.eventTitle }}</div>
                                    <div class="promotion_description">{{ item.eventExplain }}</div>
                                  </div>
                                  <div class="banner_img">
                                    <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                  </div>
                                </a>
                              </li>
                              <li v-else>
                                <a :href="item.link">
                                  <div class="bottom_item best">
                                    <div class="bottom_item">
                                      <div class="img_wrap">
                                        <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                      </div>
                                      <div class="category_info">
                                        <div class="category_title">{{ item.productName }}</div>
                                        <div class="category_price">
                                          <span class="discount_percentage">{{ item.percent }}</span>
                                          <div class="price">
                                            <!--                                            <div class="base_price">410,900원</div>-->
                                            <div class="sale_price">{{ item.discountPrice }}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            </template>

                          </template>
                        </ul>
                      </li>
                    </swiper-slide>
                  </template>
                </swiper>
              </ul>
            </div>
          </article>
        </div>
      </div>
      <div class="content_02">
        <div class="inner">
          <h2 class="sec_main_title bulb">이 상품 어때요?</h2>
          <article>
            <div class="main_article_02">
              <ul class="product_list_wrap three_list">
                <swiper :options="mainArticleTwo">
                  <template v-for="item in event_content_02">
                    <swiper-slide>
                      <template v-if="item.inSite">
                        <li>
                          <nuxt-link :to="item.link">
                            <div class="product_img circle">
                              <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                            </div>
                            <div class="category_info">
                              <div class="category_info">
                                <div class="category_title text_center">{{ item.productName }}</div>
                                <div class="category_price txt_center">
                                  <span class="discount_percentage">{{ item.percent }}</span>
                                  <div class="price">
                                    <div class="base_price">{{ item.basePrice }}</div>
                                    <div class="sale_price">{{ item.discountPrice }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </nuxt-link>
                        </li>
                      </template>
                      <template v-else>
                        <li>
                          <a :href="item.link">
                            <div class="product_img circle">
                              <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                            </div>
                            <div class="category_info">
                              <div class="category_info">
                                <div class="category_title text_center">{{ item.productName }}</div>
                                <div class="category_price txt_center">
                                  <span class="discount_percentage">{{ item.percent }}</span>
                                  <div class="price">
                                    <div class="base_price">{{ item.basePrice }}</div>
                                    <div class="sale_price">{{ item.discountPrice }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      </template>
                    </swiper-slide>
                  </template>
                </swiper>
              </ul>
            </div>
          </article>
        </div>
      </div>
      <div class="content_03">
        <div class="inner">
          <h2 class="sec_main_title trophy">MOLLY BEST 10</h2>
          <article>
            <div class="main_article_03">
              <article>
                <ul class="promotion_slide_list number">
                  <swiper :options="mainArticleThree">
                    <template v-for="item in event_content_03">
                      <swiper-slide class="inner_list">
                        <template v-if="item.inSite">
                          <li>
                            <nuxt-link :to="item.link">
                              <div class="category_list">
                                <div class="img_wrap">
                                  <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                </div>
                                <div class="category_info">
                                  <div class="category_title">{{ item.productName }}</div>
                                  <div class="category_price">
                                    <span class="discount_percentage">{{ item.percent }}</span>
                                    <div class="price">
                                      <div class="base_price">{{ item.basePrice }}</div>
                                      <div class="sale_price">{{ item.discountPrice }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </nuxt-link>
                          </li>
                        </template>
                        <template v-else>
                          <li>
                            <a :href="item.link">
                              <div class="category_list">
                                <div class="img_wrap">
                                  <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                </div>
                                <div class="category_info">
                                  <div class="category_title">{{ item.productName }}</div>
                                  <div class="category_price">
                                    <span class="discount_percentage">{{ item.percent }}</span>
                                    <div class="price">
                                      <div class="base_price">{{ item.basePrice }}</div>
                                      <div class="sale_price">{{ item.discountPrice }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </template>
                      </swiper-slide>
                    </template>
                  </swiper>
                </ul>
                <div class="swiper-button-prev article-two-prev hidden-xs" slot="button-prev"></div>
                <div class="swiper-button-next article-two-next hidden-xs" slot="button-next"></div>
              </article>
            </div>
          </article>
        </div>
      </div>
      <div class="evt_banner">
        <nuxt-link to="/user/regist">
          <div class="banner_info">
            <div class="evt_title">몰리 회원가입하고 2000원 받아가세요.</div>
            <div class="sub_text">회원가입 바로가기</div>
          </div>
        </nuxt-link>
      </div>
      <div class="content_04">
        <h2 class="sec_main_title gift_box">MOLLY의 특별한 기획전!</h2>
        <article>
          <div class="main_article_04">
            <ul class="product_list_wrap three_list number">
              <swiper :options="mainArticleFour">
                <template v-for="slide in event_content_04">
                  <swiper-slide>
                    <template v-for="item in slide">
                      <li class="inner_list">
                        <ul class="prd_info" v-if="item.inSite">
                          <li class="top_wrap m_b_20" v-if="item.banner">
                            <nuxt-link :to="item.link">
                              <div class="img_wrap">
                                <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                              </div>
                              <div class="exhibition_box">
                                <div class="sub_title">{{ item.eventTitle }}</div>
                                <div class="sub_text">{{ item.eventExplain }}</div>
                              </div>
                            </nuxt-link>
                          </li>
                          <li v-else>
                            <nuxt-link :to="item.link">
                              <div class="bottom_item">
                                <div class="sub_img">
                                  <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                                </div>
                                <div class="category_info">
                                  <div class="category_title">{{ item.productName }}</div>
                                  <div class="category_price">
                                    <span class="discount_percentage">{{ item.percent }}</span>
                                    <div class="price">
                                      <!--                                        <div class="base_price">{{ item.basePrice }}</div>-->
                                      <div class="sale_price">
                                        {{ item.discountPrice ? item.discountPrice : item.basePrice }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </nuxt-link>
                          </li>
                        </ul>
                        <ul class="prd_info" v-else>
                        <li class="top_wrap m_b_20" v-if="item.banner">
                          <a :href="item.link">
                            <div class="img_wrap">
                              <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                            </div>
                            <div class="exhibition_box">
                              <div class="sub_title">{{ item.eventTitle }}</div>
                              <div class="sub_text">{{ item.eventExplain }}</div>
                            </div>
                          </a>
                        </li>
                        <li v-else>
                          <a :href="item.link">
                            <div class="bottom_item">
                              <div class="sub_img">
                                <img :src="item.src ? item.src : '@/assets/img/product_default_img.png'"/>
                              </div>
                              <div class="category_info">
                                <div class="category_title">{{ item.productName }}</div>
                                <div class="category_price">
                                  <span class="discount_percentage">{{ item.percent }}</span>
                                  <div class="price">
                                    <!--                                        <div class="base_price">{{ item.basePrice }}</div>-->
                                    <div class="sale_price">
                                      {{ item.discountPrice ? item.discountPrice : item.basePrice }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                      </li>
                    </template>
                  </swiper-slide>
                </template>
              </swiper>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    name: 'mainArticle',
    mainArticle: {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      slidesPerGroupSkip: 1,
      loop: true,
      grabCursor: true,
    },
    mainArticleTwo: {
      slidesPerView: 1.5,
      spaceBetween: 20,
      centeredSlides: false,
      slidesPerGroupSkip: 1,
      grabCursor: true,
    },
    mainArticleThree: {
      slidesPerView: 2.2,
      spaceBetween: 20,
      speed: 500,
      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: '.article-two-next',
        prevEl: '.article-two-prev',
      },
    },
    mainArticleFour: {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      slidesPerGroupSkip: 1,
      grabCursor: true,
    },
    event_content_01: {
      slide_hot: {
        item_1: {
          banner: true,
          link: '',
          eventTitle: '',
          eventExplain: '',
          productName: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/620a0ae8c9fdd281bfcd702e',
          eventTitle: '',
          eventExplain: '',
          productName: '아르조파 휴대용 모니터 15.6',
          discountPrice: '174,600원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/620a0dec4633104c6f194ace',
          eventTitle: '',
          eventExplain: '',
          productName: '샤오미 미패드 5 태블릿PC 256GB',
          discountPrice: '449,000원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_3.png',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/620a0f5c4633104c6f194ae6',
          eventTitle: '',
          eventExplain: '',
          productName: '구글 크롬캐스트 3세대',
          discountPrice: '39,000원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_4.png',
          inSite: true,
        },
        item_5: {
          banner: false,
          link: '/product/620a103b4633104c6f194af8',
          eventTitle: '',
          eventExplain: '',
          productName: '스탠리 레거시 쿼드백 머그',
          discountPrice: '25,920원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_5.jpg',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/620a132dc9fdd281bfcd70a8',
          eventTitle: '',
          eventExplain: '',
          productName: '필립스 스포츠 커널식 노이즈캔슬링 트루와이어리스 블루투스이어폰',
          discountPrice: '37,900원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_6.jpg',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/620a14174633104c6f194b1e',
          eventTitle: '',
          eventExplain: '',
          productName: '파나소닉 일렉트릭 케틀 가정용포트 화이트 1.5L',
          discountPrice: '33,830원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_hot_7.jpg',
          inSite: true,
        },
      },
      slide_fashion: {
        item_1: {
          banner: true,
          link: '',
          eventTitle: '',
          eventExplain: '',
          productName: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/61e53608447e7eb03887e8c5',
          eventTitle: '',
          eventExplain: '',
          productName: '컨버스 1970S 로우탑 남녀공용스니커즈 162063',
          discountPrice: '59,700원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/61e53461c95d91a2f4762baf',
          eventTitle: '',
          eventExplain: '',
          productName: '나이키 여성 맨투맨 BV4113',
          discountPrice: '53,070원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_3.png',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/61e533cf447e7eb03887e893',
          eventTitle: '',
          eventExplain: '',
          productName: '아식스 아서 젤 카야노 14 남녀공용패션운동화',
          discountPrice: '133,700원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_4.png',
          inSite: true,
        },
        item_5: {
          banner: false,
          link: '/product/61e664d1447e7eb0388832c7',
          eventTitle: '',
          eventExplain: '',
          productName: '나이키 가방 DB0490-010 헤리티지 웨이스트백 힙색 블랙',
          discountPrice: '20,570원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_5.png',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/61e531c7c95d91a2f4762b48',
          eventTitle: '',
          eventExplain: '',
          productName: '스투시 면 자수 남녀공용야구모자 SUSCP131965XE',
          discountPrice: '26,000원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_6.png',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/61e530f1c95d91a2f4762b3d',
          eventTitle: '',
          eventExplain: '',
          productName: '스투시 면 프린팅 남녀공용 후드티 SUSSW192436D',
          discountPrice: '61,800원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_fashion_7.png',
          inSite: true,
        },
      },
      slide_life: {
        item_1: {
          banner: true,
          link: '',
          eventTitle: '',
          eventExplain: '',
          productName: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/6204b46c4633104c6f18aaa5',
          eventTitle: '',
          eventExplain: '',
          productName: 'WJSHOP 커피 핸드 드립 모카포트 커피도구 화이트 (150ml/300ml)',
          discountPrice: '17,620원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/6204b71fc9fdd281bfccfcb0',
          eventTitle: '',
          eventExplain: '',
          productName: '재사용 스탠딩 실리콘 지퍼백 500ml*3+1000ml*2',
          discountPrice: '21,190원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_3.png',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/6204bd90c9fdd281bfccfd22',
          eventTitle: '',
          eventExplain: '',
          productName: 'JENMV 조미료분쇄기',
          discountPrice: '18,900원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_4.jpg',
          inSite: true,
        },
        item_5: {
          banner: false,
          link: '/product/6204bf044633104c6f18ad4d',
          eventTitle: '',
          eventExplain: '',
          productName: '스테인리스 가정용 전자저울 5kg 베이킹저울 주방 전자저울',
          discountPrice: '14,680원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_5.jpg',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/6204c1b1c9fdd281bfcd0020',
          eventTitle: '',
          eventExplain: '',
          productName: 'STouch 소형 믹서기 휴대용 미니 무선 믹서기 1인용 300ML',
          discountPrice: '18,000원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_6.jpg',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/6204c3734633104c6f18ad8b',
          eventTitle: '',
          eventExplain: '',
          productName: '프리미엄 1인 가정용 미니화로 캠핑 블랙 풀세트 고기불판 휴대용그릴',
          discountPrice: '26,080원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_life_7.png',
          inSite: true,
        },
      },
      slide_beauty: {
        item_1: {
          banner: true,
          link: '',
          eventTitle: '',
          eventExplain: '',
          productName: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/6209c78fc9fdd281bfcd6067',
          eventTitle: '',
          eventExplain: '',
          productName: '안란 하이퀄리티 속눈썹고데기',
          discountPrice: '17,240원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/6209c92c4633104c6f192b7b',
          eventTitle: '',
          eventExplain: '',
          productName: '콘카 음이온 고출력 헤어 드라이어 1000W',
          discountPrice: '13,900원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_3.jpg',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/6209ccd84633104c6f192bdb',
          eventTitle: '',
          eventExplain: '',
          productName: '오랄비 바이탈리티 일렉트릭 칫솔 전동칫솔 블루',
          discountPrice: '27,060원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_4.jpg',
          inSite: true,
        },
        item_5: {
          banner: false,
          link: '/product/620b1da306604b007046a109',
          eventTitle: '',
          eventExplain: '',
          productName: '에스케이지 서비컬 스마트 온도유지 목마사지기 핸디형 아이보리',
          discountPrice: '31,760원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_5.jpg',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/6209e329c9fdd281bfcd6728',
          eventTitle: '',
          eventExplain: '',
          productName: 'Inface 울트라 소닉 이온 클렌징 피부마사지',
          discountPrice: '25,780원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_6.png',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/620b0bef045d20aa0152749c',
          eventTitle: '',
          eventExplain: '',
          productName: '필립스 노렐코 시리즈 3000 비어드 & 스터블 트리머 전기면도기',
          discountPrice: '49,060원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_beauty_7.png',
          inSite: true,
        },
      },
      slide_review: {
        item_1: {
          banner: true,
          link: '',
          eventTitle: '리뷰로 검증된 직구식품',
          eventExplain: '',
          productName: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/6209ee0fc9fdd281bfcd68d2',
          eventTitle: '',
          eventExplain: '',
          productName: 'Quest Nutrition 프로틴 쿠키 12개입',
          discountPrice: '23,390원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/6209f0c6c9fdd281bfcd68e6',
          eventTitle: '',
          eventExplain: '',
          productName: '스타벅스 하우스 블렌드 리치 & 라이블리 커피 미디엄',
          discountPrice: '24,950원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_3.jpg',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/6209f2b04633104c6f193d11',
          eventTitle: '',
          eventExplain: '',
          productName: '커클랜드시그니춰 블루 아가베 시럽',
          discountPrice: '14,270원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_4.jpg',
          inSite: true,
        },
        item_5: {
          banner: false,
          link: '/product/6209f7e54633104c6f193f43',
          eventTitle: '',
          eventExplain: '',
          productName: '마누카헬스 MGO 263+ 마누카 허니',
          discountPrice: '30,930원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_5.png',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/620a01404633104c6f1948a1',
          eventTitle: '',
          eventExplain: '',
          productName: 'Organic Valley 퓨리티 팜스 오가닉 기버터',
          discountPrice: '11,930원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_6.jpg',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/620a07294633104c6f194970',
          eventTitle: '',
          eventExplain: '',
          productName: '치토스 크런치',
          discountPrice: '7,290원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_1/p_review_7.jpg',
          inSite: true,
        },
      },
    },
    event_content_02: {
      item_1: {
        link: '/product/6182170cf5288ea0b3647246',
        productName: '바둑판 체커 이불 커버 4 피스 침대 시트 3 기숙사 세트',
        basePrice: '',
        discountPrice: '25,900원',
        percent: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_3/pc_3_1.jpg',
        inSite: true,
      },
      item_2: {
        link: '/product/61e607fe1c6af473540b1b60',
        productName: '2022 새해 호랑이 DIY 백호 카펫 방석 포케 자수 패키지',
        basePrice: '',
        discountPrice: '44,100원',
        percent: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_3/pc_3_2.jpg',
        inSite: true,
      },
      item_3: {
        link: '/product/611d913e9eeeb7c33ed6151e',
        productName: '휴대용 접이식 소형 의류 미니 세탁기',
        basePrice: '',
        discountPrice: '53,300원',
        percent: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_3/pc_3_3.jpg',
        inSite: true,
      },
    },
    event_content_03: {
      item_1: {
        link: '/product/61191417e5dd833628ca1dbc',
        productName: '써머레디백 기내용 소형 미니 캐리어 - 12/14/16인치 캐리어결합가능',
        basePrice: '',
        discountPrice: '17,600원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_1.jpg',
        inSite: true,
      },
      item_2: {
        link: '/product/61dfcf5d8277e87aef766a4a',
        productName: '콜라 라이프 하프 윈드 패딩 재킷 아메카지',
        basePrice: '',
        discountPrice: '86,510원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_2.jpg',
        inSite: true,
      },
      item_3: {
        link: '/product/611d9bdfc6d121f5f1cfed27',
        productName: '무지개 컬러 실리콘 주방 용품 세트',
        basePrice: '',
        discountPrice: '25,260원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_3.jpg',
        inSite: true,
      },
      item_4: {
        link: '/product/611e0dbb102e516dd2dedaa0',
        productName: '곰돌이 텀블러 에코백 세트',
        basePrice: '',
        discountPrice: '11,970원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_4.jpg',
        inSite: true,
      },
      item_5: {
        link: '/product/61cd65112041d089adfd23f4',
        productName: '그린 하우스 수입 호주 순수 모직 귀여운 강아지 플러시 카펫',
        basePrice: '',
        discountPrice: '86,990원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_5.jpg',
        inSite: true,
      },
      item_6: {
        link: '/product/611d868b9eeeb7c33ed5e27c',
        productName: '레트로 빈티지 구스 세라믹 플레이트 머그 세트',
        basePrice: '',
        discountPrice: '14,200원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_6.jpg',
        inSite: true,
      },
      item_7: {
        link: '/product/62006d70e22d8a53ef9748ed',
        productName: '진주 러브 팬턴트 목걸이',
        basePrice: '',
        discountPrice: '11,320원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_7.jpg',
        inSite: true,
      },
      item_8: {
        link: '/product/620496cca422ed5bda4aeb7d',
        productName: '큐티 공룡 그립톡 핸드폰 케이스',
        basePrice: '',
        discountPrice: '9,640원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_8.jpg',
        inSite: true,
      },
      item_9: {
        link: '/product/61df7723880050c9bf023290',
        productName: '북유럽 원목 등나무 협탁 수납장',
        basePrice: '',
        discountPrice: '198,190원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_9.jpg',
        inSite: true,
      },
      item_10: {
        link: '/product/6119115d4762b15891a8b870',
        productName: 'MOREOVER 오리지날 디자인 코튼 쿠션 북유럽',
        basePrice: '',
        discountPrice: '21,800원',
        percent: '',
        storeName: '',
        starScore: '',
        src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_2/pc_2_10.jpg',
        inSite: true,
      },
    },
    event_content_04: {
      slide_1: {
        item_1: {
          banner: true,
          link: '/price_group?cate=610a484c5f64f2df12e40257',
          eventTitle: '메이크업 기획전',
          eventExplain: '블링블링 색조메이크업 아이템',
          productName: '',
          basePrice: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_1.png',
          inSite: true,
        },
        item_2: {
          banner: false,
          link: '/product/61cbb0912041d089adfd02a0',
          eventTitle: '',
          eventExplain: '',
          productName: '리틀 무드 립 머드 매트 벨벳 논페이딩 논스틱 립스틱 립글로스 (단품/2종세트)',
          basePrice: '',
          discountPrice: '9,240원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_2.png',
          inSite: true,
        },
        item_3: {
          banner: false,
          link: '/product/61d29a142041d089adfd2617',
          eventTitle: '',
          eventExplain: '',
          productName: 'Huatuo 35 컬러 eye섀도우 팔레트 반짝이 스팽글',
          basePrice: '',
          discountPrice: '16,300원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_3.jpg',
          inSite: true,
        },
        item_4: {
          banner: false,
          link: '/product/61d29d092041d089adfd26a3',
          eventTitle: '',
          eventExplain: '',
          productName: '헤디 워터프루프 마스카라',
          basePrice: '',
          discountPrice: '8,400원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_4.png',
          inSite: true,
        },
      },
      slide_2: {
        item_5: {
          banner: true,
          link: '/price_group?q=%5B%ED%99%88%EC%B9%B4%ED%8E%98%5D',
          eventTitle: '홈카페 기획전',
          eventExplain: '우리집도 이제 카페처럼!',
          productName: '',
          basePrice: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_5.jpg',
          inSite: true,
        },
        item_6: {
          banner: false,
          link: '/product/61fc909c69b818668b7d889e',
          eventTitle: '',
          eventExplain: '',
          productName: '클래식 올매치 빈티지 글라스 커피잔 & 소서 세트',
          basePrice: '',
          discountPrice: '11,390원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_6.jpg',
          inSite: true,
        },
        item_7: {
          banner: false,
          link: '/product/61fc8d76df53f07e4ce03c47',
          eventTitle: '',
          eventExplain: '',
          productName: '화이트 퓨어 세라믹 디저트 플레이트 샐러드 접시 / 세트할인',
          basePrice: '',
          discountPrice: '12,020원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_7.jpg',
          inSite: true,
        },
        item_8: {
          banner: false,
          link: '/product/61c12c002041d089adfcb5ec',
          eventTitle: '',
          eventExplain: '',
          productName: '모어에버 베이커리 앞치마 단품/세트',
          basePrice: '',
          discountPrice: '31,650원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_8.jpg',
          inSite: true,
        },
      },
      slide_3: {
        item_9: {
          banner: true,
          link: '/price_group?cate=610a47ae5f64f2df12e3f5db',
          eventTitle: '반려동물 기획전',
          eventExplain: '어서오시개 할인한다냥',
          productName: '',
          basePrice: '',
          discountPrice: '',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_9.jpg',
          inSite: true,
        },
        item_10: {
          banner: false,
          link: '/product/611daab8c6d121f5f1d00e0c',
          eventTitle: '',
          eventExplain: '',
          productName: '강아지 고양이 우주선 배낭',
          basePrice: '',
          discountPrice: '24,960원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_10.jpg',
          inSite: true,
        },
        item_11: {
          banner: false,
          link: '/product/61cc22d52041d089adfd1f74',
          eventTitle: '',
          eventExplain: '',
          productName: '냄새방지 밀폐 고양이 화장실',
          basePrice: '',
          discountPrice: '53,480원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_11.jpg',
          inSite: true,
        },
        item_12: {
          banner: false,
          link: '/product/61cc237e2041d089adfd1f82',
          eventTitle: '',
          eventExplain: '',
          productName: '반려동물 강아지 고양이 자동 급식 정수기',
          basePrice: '',
          discountPrice: '26,980원',
          percent: '',
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/promotion_4/pc_4_12.jpg',
          inSite: true,
        },
      },
    },
  }),
};
</script>
