import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import util from '@/assets/javascripts/util';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'store/request/info';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    preview: {
      license: '',
      sale: '',
    },
    categories_list: [],
    represent_categories: [],
    selectedCategoryObj: {},
    ageTarget: [],
    selected_age_targets: [],
    license: '',
    sale: '',
    store: {
      store_type: '',
      account_info: {
        email: '',
        password: '',
        passwordCheck: '',
      },
      business_info: {
        store_name: '',
        company_name: '',
        phone: '',
        license_num: '',
        sale_num: '',
        ceo_name: '',
        email: '',
        mail_order_report_num: '',
        status: '',
        item: '',
        address: '',
        detail_address: '',
        zipcode: '',
        sigungu_code: '',
      },
      admin: {
        name: '',
        phone: '',
      },
      kakao_plus_url: '',
      instagram_id: '',
    },
    has_abroad_product: false,
    isPasswordConfirm: true,
    storeTypes: [],
  }),
  async fetch({ store }) {
    await store.dispatch('common/getCodes', ['store_type', 'age_target']);
    await store.dispatch(`${prefix}/getCategories`);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      result: `${prefix}/result`,
      categories: `${prefix}/categories`,
    }),
  },
  created() {
    const query = { ...this.$route.query };
    if (!query.services || !query.privacy || !query.third) this.$router.push({ name: 'store-request-check' });

    this.categories_list.push(this.categories);
    this.ageTarget = this.codesArray('age_target');
    this.storeTypes = this.codesArray('store_type');
    if (this.storeTypes.length > 0) this.store.store_type = this.storeTypes[0].key;
  },
  mounted() {
  },
  methods: {
    async selectedCategories(e) {
      const that = this;
      const id = e.target.id;
      const startCount = Number(e.target.id) + 1;
      const deleteCount = that.categories_list.length - startCount;

      that.categories_list.splice(startCount, deleteCount);

      if (e.target.value) {
        const query = {};
        query._id = e.target.value;
        const res = await that.$axios.get('user/store/request/category', { params: query });
        if (res.data.data.categories.length > 0) that.categories_list.push(res.data.data.categories);
      }
      const element = document.getElementById(id);
      const name = element[element.selectedIndex].getAttribute('name');
      const _id = e.target.value;

      if (id === '0') that.selectedCategoryObj = {};
      if (name && _id) that.selectedCategoryObj[id] = { _id, name };
    },
    addCategoryGroup() {
      const that = this;
      if (Object.keys(that.selectedCategoryObj).length > 0) {
        if (that.represent_categories.length < 5) {
          that.represent_categories.push(Object.values(that.selectedCategoryObj));
          document.getElementById('0').options[0].selected = true;
          that.categories_list.splice(1, 4);
          that.selectedCategoryObj = {};
        } else {
          this.$popup.showAlertPopup('최대 5개까지 추가할 수 있습니다.');
        }
      } else {
        this.$popup.showAlertPopup('카테고리를 추가해주세요.');
      }
    },
    deleteCategory(idx) {
      this.represent_categories.splice(idx, 1);
    },
    setTarget(e) {
      const value = e.target.value;
      if (this.selected_age_targets.indexOf(value) === -1 && e.target.checked === true) {
        this.selected_age_targets.push(value);
      } else {
        this.selected_age_targets.splice(this.selected_age_targets.indexOf(value), 1);
      }
      this.selected_age_targets.sort((a, b) => (a - b));
      this.store.age_start = this.selected_age_targets[0];
      this.store.age_end = this.selected_age_targets[this.selected_age_targets.length - 1];
    },
    changedStoreType(e) {
      const storeType = e.target.value;
      if (storeType === 'ABROAD') {
        this.has_abroad_product = true;
      }
    },
    validation(email) {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      return re.test(email);
    },
    fileUpload(e) {
      const that = this;
      const target = e.target.id;
      const imageFile = e.target.files[0];
      const recommendSize = (10 * 1024 * 1024);

      if (recommendSize > imageFile.size) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event) => {
          that[target] = imageFile;
          that.preview[target] = event.target.result;
        };
      } else {
        that.popupAlert('크기가 10MB를 넘지 않는 파일을 등록해주세요.');
      }
    },
    postCode(targetEleId) {
      util.showSearchAddress(targetEleId, (data) => {
        this.store.business_info.zipcode = data.zonecode;
        this.store.business_info.address = data.address;
        this.store.business_info.sigungu_code = data.sigungu_code;
      });
    },
    closeSearchAddress(targetEleId) {
      util.closeSearchAddress(targetEleId);
    },
    copyBusinessInfo(e) {
      const isCopy = e.target.checked;
      if (isCopy) {
        this.store.admin.name = this.store.business_info.ceo_name;
        this.store.admin.phone = this.store.business_info.phone;
      }
    },
    enterCancel() {
      this.$router.go(-1);
    },
    async enterRequest() {
      const that = this;
      const isEmptyList = [];

      if (!that.store.account_info.email) isEmptyList.push('계정 정보 - 이메일');
      if (!that.store.account_info.password) isEmptyList.push('계정 정보 - 비밀번호');
      if (!that.store.account_info.passwordCheck) isEmptyList.push('계정 정보 - 비밀번호 확인');

      if (that.store.account_info.password === that.store.account_info.passwordCheck) that.isPasswordConfirm = true;
      else that.isPasswordConfirm = false;

      if (!that.license) isEmptyList.push('사업자 정보 - 사업자등록증');
      if (!that.store.business_info.license_num) isEmptyList.push('사업자 정보 - 사업자등록번호');
      if (!that.store.business_info.company_name) isEmptyList.push('사업자 정보 - 업체명');
      if (!that.store.business_info.store_name) isEmptyList.push('사업자 정보 - 쇼핑몰 이름');
      if (that.represent_categories.length <= 0) isEmptyList.push('대표 상품군');
      if (that.selected_age_targets.length <= 0) isEmptyList.push('타겟 연령층');
      if (!that.store.business_info.phone) isEmptyList.push('사업자 정보 - 대표전화');
      if (!that.store.business_info.ceo_name) isEmptyList.push('사업자 정보 - 대표자 성명');
      if (!that.store.business_info.email) isEmptyList.push('사업자 정보 - 대표 이메일');
      if (!that.sale) isEmptyList.push('사업자 정보 - 통신판매업신고증');
      if (!that.store.business_info.sale_num) isEmptyList.push('사업자 정보 - 통신판매업신고번호');
      if (!that.store.business_info.status) isEmptyList.push('사업자 정보 - 업태');
      if (!that.store.business_info.item) isEmptyList.push('사업자 정보 - 종목');

      if (!that.store.business_info.zipcode) isEmptyList.push('사업자 정보 - 사업장 주소');
      if (!that.store.business_info.address) isEmptyList.push('사업자 정보 - 사업장 주소');

      if (!that.store.admin.name) isEmptyList.push('담당자 정보 - 이름');
      if (!that.store.admin.phone) isEmptyList.push('담당자 정보 - 휴대폰 번호');

      if (isEmptyList.length === 0 && that.isPasswordConfirm) {
        const data = {
          account_info: that.store.account_info,
          business_info: that.store.business_info,
          admin: that.store.admin,
          store_type: that.store.store_type,
          licenseImage: this.license,
          saleImage: this.sale,
          represent_categories: this.represent_categories.map((group) => group[group.length - 1]._id),
          selected_age_targets: this.selected_age_targets,
          kakao_plus_url: this.store.kakao_plus_url,
          instagram_id: this.store.instagram_id,
          has_abroad_product: this.has_abroad_product,
        };
        await that.$store.dispatch(`${prefix}/createEnterRequest`, data);
        if (that.result.result === 'success') {
          that.popupAlert('판매자 입점 신청이 성공적으로 신청되었습니다.');
          that.$router.push({ name: 'main' });
        } else {
          that.popupAlert(that.result.message);
        }
      } else {
        new Popup.Alert({
          propsData: {
            title: `다음을 확인해주세요.\n${isEmptyList.join('\n')}`,
            okCallback: (params) => {
              if (!that.validation(that.store.account_info.email)) that.$refs.email.focus();
              else if (!that.isPasswordConfirm) that.$refs.passwordCheck.focus();
              else if (!that.validation(that.store.business_info.email)) that.$refs.business_info_email.focus();
              Object.keys(that.$refs).every((key) => {
                if (!that.$refs[key].value) return that.$refs[key].focus();
                return false;
              });
              params.$destroy();
            },
          },
        }).$mount();
      }
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
