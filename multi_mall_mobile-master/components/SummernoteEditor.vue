<template>
  <div :id="summernoteId" class="summernoteWrap"></div>
</template>

<script>
import _ from 'lodash';

const defaultImage = require('@/assets/img/product_default_img.png');

export default {
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css' },
    ],
  },
  name: 'SummernoteEditor',
  props: {
    summernoteId: {
      type: String,
      default: 'summernote',
    },
    detailContent: {
      type: String,
      default: '',
    },
    detailImageArr: {
      type: Array,
      default: () => [],
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    content: '',
    detailImages: [],
    blankSrc: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  }),
  mounted() {
    window.$(`#${this.summernoteId}`).summernote({
      lang: 'ko-KR',
      callbacks: {
        onInit: () => {
          if (this.detailContent) {
            let detailContent = this.detailContent;
            if (this.detailImageArr && this.detailImageArr.length > 0) {
              _.sortBy(this.detailImageArr, (i) => i.order).forEach((detailImage) => {
                const image = detailImage.image ? detailImage.image : defaultImage;
                const re = new RegExp(`order_${detailImage.order}(?![0-9])`, 'g');
                detailContent = detailContent.replace(re, image);
              });
            } else detailContent = detailContent.replace(/order_[0-9]*/g, defaultImage);
            window.$(`#${this.summernoteId}`).summernote('code', detailContent);
          }
          if (this.preview) {
            window.$(`#${this.summernoteId}`).summernote('code');
            window.$(`#${this.summernoteId}`).summernote('destroy');
          }
        },
        onImageUpload: (files) => {
          const filesLength = files.length;
          for (let idx = 0; idx < filesLength; idx += 1) {
            const imageToBlob = window.URL.createObjectURL(files[idx]);
            const orderNum = this.detailImages.length;
            this.detailImages.push({ blobImage: imageToBlob, image: files[idx], order: orderNum });
            window.$(`#${this.summernoteId}`).summernote('insertImage', imageToBlob);
          }
          this.$forceUpdate();
        },
        onChange: (html) => {
          let htmlObject = document.createElement('div');
          htmlObject.innerHTML = html;
          const imageTags = htmlObject.querySelectorAll('img');
          const detailImages = [];
          if (imageTags && imageTags.length > 0) {
            imageTags.forEach((tag, index) => {
              let dImage = _.find(this.detailImageArr, (di) => di.image === tag.src);
              if (dImage) {
                detailImages.push({
                  image: dImage.image,
                  order: index + 1,
                  original_order: dImage.order,
                  is_image_file: false,
                });

                tag.src = this.blankSrc;
                tag.setAttribute('data-order', (index + 1).toString());
              } else {
                dImage = _.find(this.detailImages, (di) => di.blobImage === tag.src);
                if (dImage) {
                  detailImages.push({
                    image: dImage.image,
                    order: index + 1,
                    is_image_file: true,
                  });

                  tag.src = this.blankSrc;
                  tag.setAttribute('data-order', (index + 1).toString());
                }
              }
            });
          }

          this.content = htmlObject.innerHTML;
          htmlObject.children.forEach((elem) => {
            htmlObject.removeChild(elem);
          });
          htmlObject = null;

          // image tag의 src를 order-{\d}으로 치환시킴
          do {
            this.content = _.replace(this.content, /src=".{74}" (style=".{0,100}")? ?data-order="[0-9]*"/, (c) => {
              if (c) {
                let orderArr = null;
                c = _.replace(c, /data-order="[0-9]*"/, (o) => { orderArr = o.split('"'); return ''; });
                if (orderArr && orderArr.length > 1) {
                  c = c.toString().replace(this.blankSrc, `order_${orderArr[1]}`);
                  return c;
                }
              }
              return c;
            });
          } while (/src=".{74}" (style=".{0,100}")? ?data-order="[0-9]*"/.test(this.content));

          if (this.content.indexOf('<u>') > -1) this.content = this.content.replace(/<u>/gm, '<u style="text-decoration: underline !important;">');
          if (this.content.indexOf('<strike>') > -1) this.content = this.content.replace(/<strike>/gm, '<strike style="text-decoration: line-through !important;">');
          if (this.content.indexOf('<i>') > -1) this.content = this.content.replace(/<i>/gm, '<i style="font-style: italic !important;">');
          if (this.content.indexOf('<ul><li>') > -1) this.content = this.content.replace(/<ul><li>/gm, '<ul><li style="list-style: disc !important;">');
          if (this.content.indexOf('<ul>') > -1) this.content = this.content.replace(/<ul>/gm, '<ul style="list-style-type: disc !important;">');
          if (this.content.indexOf('<ol><li>') > -1) this.content = this.content.replace(/<ol><li>/gm, '<ol><li style="list-style: decimal !important;">');
          if (this.content.indexOf('<ol>') > -1) this.content = this.content.replace(/<ol>/gm, '<ol style="list-style-type: decimal !important;">');
          this.$forceUpdate();
          const data = {
            content: this.content,
            detail_images: detailImages,
          };
          this.$emit('setDetailContent', data);
        },
      },
      toolbar: [
        ['style', ['style']],
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['color', ['color']],
        ['fontsize', ['fontsize']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['Insert', ['picture']],
        ['Mics', ['fullscreen', 'codeview', 'undo', 'redo']],
      ],
    });
  },
};
</script>

<style lang="scss">
.summernoteWrap {
  width: 100% !important;
  img {
    max-width: 100% !important;
  }
}
  .note-btn { display: inline-block; font-weight: 400; margin-bottom: 0; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; background-image: none; white-space: nowrap; outline: 0; color: #333 !important; background-color: #fff; border: 1px solid #dae0e5; padding: 5px 10px; font-size: 14px; line-height: 1.4; border-radius: 3px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 0; }
  .note-dropdown-menu { border: 1px solid #e2e2e2 !important; z-index: 10000 !important; padding: 5px !important; box-shadow: 2px 2px 7px 0px rgba(0, 0, 0,.16) !important; z-index: 1000 !important; }
  .note-color .note-dropdown-menu { padding: 0px !important; }
  .note-dropdown-item > * { padding: 5px 10px !important; }
  .note-dropdown-item blockquote { border-left: 5px solid #eee; margin-left: 10px; }
  .note-dropdown-item pre { display: block; padding: 9.5px; margin: 0 0 10px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; }
  .note-editor .note-toolbar .note-para .note-dropdown-menu, .note-popover .popover-content .note-para .note-dropdown-menu { min-width: 230px !important; }

  /* modal */
  .note-modal-backdrop { display: none !important; }
  .note-modal { z-index: 10000 !important; }
  .note-modal-content { height: 400px; border: 1px solid rgba(0,0,0,.2); padding: 0 !important; margin: 30px auto !important; }
  .note-modal-header { padding: 10px 20px !important; border: 1px solid #ededef; }
  .note-modal-body { padding: 20px 30px !important; }
  .note-modal-footer { margin: 0 30px !important; }
  .note-modal-footer .note-btn { color: #333 !important; padding: 5px 10px !important; }
  .note-input { padding: 6px 4px !important; font-size: 14px !important; }
  .note-form-group { padding-bottom: 20px !important; }
  .note-image-input { height: unset; }

  /* full screen */
  .note-editor.note-airframe.fullscreen, .note-editor.note-frame.fullscreen { z-index: 5000 !important; }
  .note-editing-area { background: #fff };

  /* tooltip custom */
  .note-tooltip-content { padding:3px 8px !important; border-radius: 3px !important; background-color: rgb(20, 204, 179) !important; }
  .note-tooltip .note-tooltip-content { padding: 0 5px !important; border-radius: 3px !important; background-color: rgb(20, 204, 179) !important; }
  .note-tooltip-arrow { border-color: transparent !important; border-style: solid !important; }
  .note-tooltip.bottom .note-tooltip-arrow { border-bottom-color: rgb(20, 204, 179) !important; }

  /* editable charactor style custom */
  .note-editable i { font-style: italic !important; }
  .note-editable strike { text-decoration: line-through !important; }
  .note-editable u { text-decoration: underline !important; }
  .note-editable ul, .note-editable ol { padding-left: 24px !important; }
  .note-editable ul { list-style-type: disc !important; }
  .note-editable ul li { list-style: disc !important; }
  .note-editable ol { list-style-type: decimal !important; }
  .note-editable ol li { list-style-type: decimal !important; }
</style>
