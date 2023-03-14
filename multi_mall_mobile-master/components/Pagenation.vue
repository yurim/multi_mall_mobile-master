<template>
  <div>
    <v-pagination
      v-model="page"
      :length="pageCount"
      :total-visible="totalVisible"
      @input="changePage">
    </v-pagination>
  </div>
</template>

<script>
export default {
  props: {
    onPage: {
      type: Function,
      default() {
        return null;
      },
    },

    // 1. v-data-table 옵션
    defaultPageCount: { type: Number, default: 0 }, // 총 페이지 수

    // 2. custom table 필수 옵션 (pageCount 값 없을 시 계산 용도)
    totalCount: { type: Number, default: 0 }, // 총 item 수
    pageSize: { type: Number, default: 3 }, // 한 페이지에 출력될 게시물 수

    defaultPage: { type: Number, default: 1 }, // 현재 페이지 번호
    pageKeyName: { type: String, default: 'page' }, // query에 추가 할 page 값의 key 이름 설정
    pageSizeKeyName: { type: String, default: 'page_size' }, // query에 추가 할 pageSize 값의 key 이름 설정

    updateQuery: { type: Boolean, default: true }, // query 업데이트
  },
  created() {
    if (this.pageCount === 0) { // custom table 일 경우, pageCount는 0
      // pageCount 계산
      this.calcPageCount();
    }
  },
  watch: {
    defaultPage(newValue) {
      this.page = newValue;
    },
    totalCount: {
      async handler() {
        // pageCount 계산
        this.calcPageCount();
      },
    },
  },
  data() {
    return {
      isInit: false,
      page: this.defaultPage,
      pageCount: this.defaultPageCount,
      totalVisible: 7,
    };
  },
  methods: {
    async changePage() {
      if (this.updateQuery) {
        const query = { ...this.$route.query };
        const prevPage = query[this.pageKeyName];
        query[this.pageKeyName] = this.page;
        query[this.pageSizeKeyName] = this.pageSize;
        if (parseInt(prevPage, 10) !== this.page) {
          await this.$router.replace({ query });
        }
        if (this.onPage) {
          await this.onPage(query);
        }
      } else {
        const query = {};
        query[this.pageKeyName] = this.page;
        query[this.pageSizeKeyName] = this.pageSize;
        if (this.onPage) {
          await this.onPage(query);
        }
      }
    },
    /**
     * PageCount (총 페이지 수) 계산
     */
    calcPageCount() {
      // pageCount 계산
      let calcPage = Math.floor(this.totalCount / this.pageSize);
      if (this.totalCount % this.pageSize > 0) {
        calcPage += 1;
      }
      this.pageCount = calcPage;
    },
  },
};
</script>
