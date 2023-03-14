<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title">type === 'ASSCTN' ? '조합형' : '단독형' 이미지 적용 옵션명 선택</div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap color_main_01">
                <li> - 이미지를 적용할 옵션명을 선택해주세요. (복수선택 type === 'ASSCTN' ? '불가' : '가능')</li>
                <li> - 이미지가 등록된 후에는 값을 변경할 수 없습니다.</li>
                <li> - 이미지 등록이후 변경을 원하시면 옵션을 새로 등록해주셔야 합니다.</li>
              </ul>
              <ul class="list_wrap">
                <li>
                  <table>
                    <colgroup>
                      <col width="70">
                      <col width="100">
                      <col width="300">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>선택</th>
                        <th>
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" id="options_all">
                            <label for="options_all"></label>
                          </div>
                        </th>
                        <th>옵션명</th>
                        <th>옵션값</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="only_checkbox_wrap">
                              <input type="radio" name="selectOption">
                              <label></label>
                            <input type="checkbox">
                          </div>
                        </td>
                        <td>option.name</td>
                        <td>option.values.toString()</td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap color_main_01">
                <li> - 옵션 이미지를 올리면, 상품상세 페이지에 함께 노출됩니다.</li>
                <li> - 권장 크기 : 1000 x 1000 (최소 300 x 300)</li>
                <li> - 파일 형식 : jpg, jpeg, gif, bmp (움직이는 이미지의 경우 첫 번째 컷이 등록됩니다.)</li>
              </ul>
              <ul class="list_wrap">
                <li>
                  <div class="title w_100 m_b_10">옵션명 : imageInfo.optionName</div>
                  <div class="body w_100">
                    <div class="i_b">
                      <label>
                        <img>
                        <a class="del_icon">X</a>
                        <a class="edit_icon">수정</a>
                        <span>&#10010;</span>
                      </label>
                      <div class="img_text_wrap text-center">image.optionValueName</div>
                      <input type="file" class="display_none" accept="image/*">
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="popup_btn_wrap">
          <button @click="imageApply">이미지 등록</button>
          <button @click="ok">적용</button>
          <button class="line_btn" @click="cancel">취소</button>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import PopupMixin from './popupMixin';
import Alert from './PopAlert';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    params: {
      selectedOptions: [],
      imageInfo: [],
    },
    recommendFileSize: (10 * 1024 * 1024),
  }),
  computed: {
    allCheck: {
      get() {
        return this.options ? this.params.selectedOptions.length === this.options.length : false;
      },
      set(value) {
        let checkedOptionIds = [];
        if (value) {
          checkedOptionIds = this.options.map((option) => option.name);
        }
        this.params.selectedOptions = checkedOptionIds;
      },
    },
  },
  methods: {
    imageApply() {
      if (this.params.selectedOptions.length > 0) {
        this.params.selectedOptions.forEach((name) => {
          const images = [];
          const option = _.find(this.options, (o) => o.name === name);
          if (option) {
            option.values.forEach((value) => {
              images.push({
                optionValueName: value.trim(),
                image: '',
                imageFile: {},
              });
            });
          }

          this.params.imageInfo.push({
            optionName: name,
            images,
          });
        });
      } else {
        this.popAlert('이미지를 적용할 옵션명을 선택해주세요.');
      }
    },
    OptionImageUpload(e, image, parentIdx, childIdx) {
      let imageFile = null;
      try {
        imageFile = e.target.files[0];
      } catch {
        imageFile = this.$refs[`option_image_${parentIdx}_${childIdx}`][0].files[0];
      }

      if (this.recommendFileSize > imageFile.size) {
        image.image = window.URL.createObjectURL(imageFile);
        image.imageFile = imageFile;
      } else {
        this.popAlert('이미지 용량이 10MB를 초과합니다.');
      }
    },
    deleteImage(optionName, parentIdx, childIdx) {
      const imageInfo = _.find(this.params.imageInfo, (info) => info.optionName === optionName);
      if (imageInfo) {
        const image = imageInfo.images[childIdx];
        if (image) {
          image.image = '';
          image.imageFile = {};
          document.getElementById(`pop_image_${parentIdx}_${childIdx}`).setAttribute('src', '');
          document.getElementById(`option_image_${parentIdx}_${childIdx}`).value = '';
        }
      }
    },
    updateImage(image, parentIdx, childIdx) {
      this.OptionImageUpload('', image, parentIdx, childIdx);
    },
    ok() {
      if (this.okCallback) {
        let message = null;
        this.params.imageInfo.forEach((info) => {
          info.images.forEach((image) => {
            if (!image) {
              message = '이미지를 등록해주세요.';
              return false;
            }
          });
        });

        if (message) this.popAlert(message);
        else this.okCallback(this.params);
      }
    },
    popAlert(message) {
      new Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
});
</script>
