<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">이미지 검색</div>

            <div class="popup_text_wrap">
              <ul class="explain_wrap">
                <li>카테고리를 먼저 선택해주세요.</li>
              </ul>

              <ul class="list_wrap w_100">
                <li>
                  <div class="two_select_wrap">
                    <select v-model="selectedLevelCategories[1]" v-on:change="getMenu(selectedLevelCategories[1], 1)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[1]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[2]" v-on:change="getMenu(selectedLevelCategories[2], 2)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[2]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[3]" v-on:change="getMenu(selectedLevelCategories[3], 3)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[3]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[4]" v-on:change="getMenu(selectedLevelCategories[4], 4)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[4]" :value="category">{{category.name}}</option>
                    </select>
                  </div>
                </li>
                <li v-if="isSelectedCompleted">
                  <div class="upload_image_wrap">
                   <div class="image_wrap" v-if="uploadFileUrl">
                     <img :src="uploadFileUrl"/>
                   </div>
                   <div v-else class="txt">이미지를 업로드해주세요</div>
                  </div>
                </li>
                <li v-if="isSelectedCompleted">
                  <div class="upload_image_btn w_100">
                    <input type="file" id="upload_image" @change="uploadImage" accept="image/*">
                    <label for="upload_image">이미지 업로드</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div class="popup_btn_wrap">
          <button @click="cancel" class="line_btn">취소</button>
          <button @click="ok">검색</button>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    levelCategories: [null, [], [], [], []],
    selectedLevelCategories: [null, '선택', '선택', '선택', '선택'],
    params: {
      menuPath: [null, null, null, null, null],
      lastCategoryId: null,
      uploadFile: null,
    },
    isSelectedCompleted: false,

    maxFileSize: (10 * 1024 * 1024),

    uploadFile: null,
    uploadFileUrl: null,
  }),
  async created() {
    const res = await this.$store.$axios.get('user/category/path', { path: null, level: 1 });
    Vue.set(this.levelCategories, 1, res.data.data.categories);
  },
  methods: {
    resetCategoryData(startLevel) {
      for (let l = startLevel; l < 5; l += 1) {
        this.params.menuPath[l] = null;
        this.levelCategories[l] = [];
        this.selectedLevelCategories[l] = '선택';
      }
    },
    async getMenu(category, currentLevel) {
      const nextLevel = currentLevel + 1;

      if (currentLevel === 4) { // 마지막 뎁스까지 선택 완료
        if (category.id) {
          this.params.menuPath[currentLevel] = category.id;
          this.isSelectedCompleted = true;
        } else {
          this.params.menuPath[currentLevel] = null;
          this.isSelectedCompleted = false;
        }
        return;
      }

      this.resetCategoryData(nextLevel);

      if (category.id) {
        this.params.menuPath[currentLevel] = category.id;
        const res = await this.$store.$axios.get(`user/category/path?path=${this.params.menuPath.filter((n) => n).join(',')}&level=${nextLevel}`);
        if (res.data.result === 'success') {
          Vue.set(this.levelCategories, nextLevel, res.data.data.categories);
        } else {
          Vue.set(this.levelCategories, nextLevel, []);
        }
        this.isSelectedCompleted = !(this.levelCategories[nextLevel] && this.levelCategories[nextLevel].length > 0);
      } else {
        this.params.menuPath[currentLevel] = null;
        this.isSelectedCompleted = false;
      }
    },
    async uploadImage(e) {
      if (e.target.files.length > 0) {
        const imageFile = e.target.files[0];
        if (this.maxFileSize > imageFile.size) {
          this.uploadFileUrl = window.URL.createObjectURL(imageFile);
          this.uploadFile = imageFile;
        }
      }
    },
    ok() {
      let isChecked = true;
      let lastCategoryId = null;
      this.params.menuPath.forEach((v, i) => {
        if (!v && this.levelCategories[i] && this.levelCategories[i].length > 0) {
          isChecked = false;
        } else if (v) {
          lastCategoryId = v;
        }
      });
      this.params.lastCategoryId = lastCategoryId;
      if (!isChecked || !lastCategoryId) return this.$popup.showAlertPopup('카테고리를 선택해주세요');
      if (!this.uploadFile) return this.$popup.showAlertPopup('이미지를 업로드해주세요');
      this.params.uploadFile = this.uploadFile;
      if (this.okCallback) this.okCallback(this.params);
    },
  },
});
</script>
