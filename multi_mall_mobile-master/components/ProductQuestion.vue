<template>
  <div class="info_content">
    <div class="inquiry_top">
      <div>구매하시려는 상품에 대해 궁금하신 점이 있으신 경우 문의해주세요.</div>
      <div class="btn_s_right" v-if="isLogin && userGrade === 0">
        <a class="line_but"  @click="clickQuestionBtn">문의하기</a>
      </div>
    </div>
    <div class="inquiry_list_wrap">
      <ul class="inquiry_list_wrap__first_wrap">
        <!-- 내용 없을시-->
        <template v-if="!questions || questions.length <= 0">
          <li class="empty_text_wrap">문의가 존재하지 않습니다.</li>
        </template>

        <!-- Question item START -->
        <template v-else v-for="(questionGroup, groupIndex) in questions">
          <!-- 로그인 한 유저가 작성한 글이 아니고, 비밀글 체크시-->
          <li v-if="questionGroup[0].user_id !== userId && questionGroup[0].is_secret">
            <div><span class="brand_color m_r_10">Q</span>비밀글입니다.</div>
          </li>
          <li v-else>
            <div class="main_gray">
              <span v-if="questionGroup[0].is_replied" class="brand_color">답변완료</span>
              <span v-else class="main_gray">답변미완료</span>
            </div>
            <ul class="inquiry_list_wrap__second_wrap">
              <template v-for="(question, questionIndex) in questionGroup">
                <li>
                  <div class="pull-left"><span class="brand_color m_r_10">Q</span></div>
                  <!-- 수정/삭제 버튼 START -->
                  <div class="square_but_wrap pull-right" v-if="question.user_id === userId && !question.is_replied">
                    <template v-if="question.show_edit">
                      <a class="line_but" @click="cancelModifyQuestion(groupIndex, questionIndex)">취소</a>
                      <a @click="saveModifyQuestion(groupIndex, questionIndex)">저장</a>
                    </template>
                    <template v-else>
                      <a class="line_but" @click="deleteQuestion(question.id)">삭제</a>
                      <a @click="modifyQuestion(groupIndex, questionIndex)">수정</a>
                    </template>
                  </div>
                  <!-- 수정/삭제 버튼 END -->

                  <span>
                    <template v-if="question.show_edit">
                      <textarea v-model="question.modify_content" type="text"/>
                    </template>
                    <template v-else>
                      {{ question.content }}
                    </template>
                  </span>
                </li>

                <!-- 매장답변-->
                <li v-if="question.is_replied" v-for="answer in question.answers">
                  <div class="writer_wrap">
                    <span class="main_red m_r_10">A</span><b>{{ question.store_name_kor }}</b>
                    <span class="main_gray">{{ answer.created_at | date }}</span>
                  </div>
                  <div>
                    {{ answer.content }}
                  </div>
                </li>
              </template>

              <li v-if="questionGroup[0].user_id === userId && questionGroup[questionGroup.length - 1].is_replied">
                <!-- 로그인한 유저가 작성한 글이고 마지막 문의에 답변이 달린 경우 보임 -->
                <textarea :id="`add-question-${questionGroup[0].id}`" rows="3" placeholder="상품에 대한 문의를 작성해주세요."></textarea>
                <div class="small_but_wrap">
                  <input type="submit" value="작성" @click="addQuestion(questionGroup[0].id, questionGroup.length)" class="m_t_10">
                </div>
              </li>
            </ul>
          </li>
        </template>
      </ul>
      <div class="swiper-pagination">
        <Pagenation :total-count="questionTotalCount" :page-size="questionPageSize" :default-page="questionCurrPage"
                    :page-key-name="'question_page'" :page-size-key-name="'question_page_size'"
                    :onPage="onQuestionsPage"></Pagenation>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/javascripts/product/question/index.js"></script>
