<template>
  <div class="main_slide_wrap">
    <div class="main_slide_inner">
      <div class="swiper_wrap">
<!--        <swiper class="swiper" :options="mainSlide">-->
<!--          <swiper-slide v-for="(item, i) in mainSlide.list" :key="mainSlide.list.src">-->
<!--            <div class="main_slide_style"-->
<!--                 :style="`background-color: ${item.backgroundColor? item.backgroundColor : ''}`">-->
<!--              <template v-if="mainSlide.list.inSite">-->
<!--                <nuxt-link :to="item.link">-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </nuxt-link>-->
<!--              </template>-->
<!--              <template v-if="mainSlide.list.inSite && item.link">-->
<!--                <a :href="item.link">-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </a>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <div>-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </div>-->
<!--              </template>-->
<!--            </div>-->
<!--          </swiper-slide>-->
<!--        </swiper>-->

        <swiper class="swiper" :options="mainSlide">
          <swiper-slide >
            <div class="main_slide_style">
              <div>
                <img src='https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/mobile_molly_app_banner.png'/>
              </div>
            </div>
          </swiper-slide>
        </swiper>

<!--        <div class="center_wrap">-->
<!--          <div class="page_controller_wrap">-->
<!--            <div class="num_wrap">-->
<!--              <span id="current"></span>-->
<!--              <span>/</span>-->
<!--              <span id="total"></span>-->
<!--            </div>-->
<!--            <div class="swiper-button-prev main_prev" slot="button-prev"></div>-->
<!--            <div class="swiper-button-next main_next" slot="button-next"></div>-->
<!--          </div>-->
<!--          <ul class="number_swiper-pagination" slot="pagination"></ul>-->
<!--        </div>-->

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainSlide',
  data: () => ({
    mainSlide: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      speed: 1500,
      autoplay: {
        delay: 2500,
      },
      // loop: true,
      on: {
        init: () => {
          // const total = document.getElementsByClassName('main_slide_style').length;
          // if (total) {
          //   document.getElementById('total').innerText = `${total - 2}`;
          // } else {
          //   document.getElementById('total').innerText = '';
          // }
        },
        // slideChangeTransitionEnd: () => {
        //   const current = document.getElementsByClassName('swiper-slide-active')[0].getAttribute('data-swiper-slide-index');
        //   if (current) {
        //     document.getElementById('current').innerText = `${Number(current) + 1}`;
        //   } else {
        //     document.getElementById('current').innerText = '';
        //   }
        // },
      },
      // pagination: {
      //   el: '.number_swiper-pagination',
      //   clickable: true,
      //   renderBullet: (index, className) => {
      //     const bullet = `<li class="${className}">${index + 1}</li>`;
      //     return bullet;
      //   },
      // },
      // navigation: {
      //   nextEl: '.main_next',
      //   prevEl: '.main_prev',
      // },

      list: {
        // 외부링크는 inSite false
        slide0: {
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/mobile_molly_app_banner.png',
          backgroundColor: '',
          link: '',
          inSite: true,
        },
        // slide1: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_01.png',
        //   backgroundColor: '#FDFF8A',
        //   link: '/store/33',
        //   inSite: true,
        // },
        // slide3: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_03.png',
        //   backgroundColor: '#F5C760',
        //   link: '/price_group?cate=610a479f5f64f2df12e3f443',
        //   inSite: true,
        // },
        // slide4: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_04.png',
        //   backgroundColor: '#9BCC9E',
        //   link: '/price_group?cate=610a47da5f64f2df12e3f9c4',
        //   inSite: true,
        // },
        // slide5: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_05.png',
        //   backgroundColor: '#F7C9C9',
        //   link: '/price_group?cate=610a48155f64f2df12e3fe68',
        //   inSite: true,
        // },
        // slide6: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_06.png',
        //   backgroundColor: '#FDFF8A',
        //   link: '/price_group?cate=610a47805f64f2df12e3f0ab',
        //   inSite: true,
        // },
        // slide7: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_07.png',
        //   backgroundColor: '#F8C895',
        //   link: '/price_group?cate=610a47675f64f2df12e3ecc0',
        //   inSite: true,
        // },
        // slide8: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_08.png',
        //   backgroundColor: '#CAD8DD',
        //   link: '/price_group?cate=610a48355f64f2df12e400b3',
        //   inSite: true,
        // },
        // slide9: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_09.png',
        //   backgroundColor: '#DFDFD2',
        //   link: '/price_group?cate=610a48315f64f2df12e40072',
        //   inSite: true,
        // },
        // slide10: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_m_10.png',
        //   backgroundColor: '#9194C8',
        //   link: '/store/37',
        //   inSite: true,
        // },
      },
    },
  }),
};
</script>
