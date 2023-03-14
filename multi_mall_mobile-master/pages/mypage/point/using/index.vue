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

        <div class="point_info">
          <h3>포인트 내역</h3>
          <span class="total_points">총 포인트</span>
          <span class="info_txt">{{ current_point | comma }}원</span>
        </div>

        <!-- *** 포인트 내역 START *** -->
        <div>
          <div class="mypage_tab_nav">
            <ul>
              <li><nuxt-link to="/mypage/point/saving">적립</nuxt-link></li>
              <li class="on"><a>차감</a></li>
            </ul>
          </div>
          <table class="tb_type1">
            <colgroup>
              <col>
              <col width="100px">
            </colgroup>
            <tbody v-if="usingHistory && usingHistory.length > 0">
            <tr v-for="(history, i) in usingHistory" :key="i">
              <td>
                <div class="info_txt">{{ history.use_type }}</div>
                <div class="date">{{ $moment(history.created_at).format("YYYY-MM-DD") }}</div>
              </td>
              <td>-{{ history.point | comma }}원</td>
            </tr>
            </tbody>

            <!-- *** 포인트 내역 없음 START *** -->
            <tbody v-else>
            <tr>
              <td colspan="3" class="text-center">차감내역이 없습니다.</td>
            </tr>
            </tbody>
            <!-- *** 포인트 내역 없음 END *** -->
          </table>

          <!-- *** 페이지네이션 START *** -->
          <div class="pagenation_wrap">
            <Pagenation :total-count="totalCount" :page-size="pageSize" :default-page="defaultPage"
                        :page-key-name="'page'" :page-size-key-name="'page_size'" :onPage="onPage" />
          </div>
          <!-- *** 페이지네이션 END *** -->
        </div>
        <!-- *** 포인트 내역 END *** -->

      </div>
    </v-container>
    <Dockbar></Dockbar>
  </div>
</template>

<script src="@/assets/javascripts/mypage/point/using/index.js"></script>
