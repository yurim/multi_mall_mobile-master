import Vue from 'vue';
import vueMoment from 'vue-moment';
import moment from 'moment-timezone';
import draggable from 'vuedraggable';
import _ from 'lodash';

moment.tz.setDefault('Asia/Seoul');
Vue.use(vueMoment, {
  moment,
});

Vue.prototype._ = _;
Vue.prototype.$nodeEnv = process.env.NODE_ENV;
Vue.prototype.$selperMode = ['production', 'staging']; // todo: 셀퍼 테스트 완료 후 staging 삭제하기

Vue.component('draggable', draggable);

Vue.filter('comma', (price) => {
  const result = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return result;
});

Vue.filter('ceil', (number = 0, precision = 0) => _.ceil(number, precision));
Vue.filter('kUnit', (number) => {
  if (number > 1000) {
    return `${_.floor((number / 1000), 1)}k`;
  }
  return number;
});

Vue.filter('rate', (value) => {
  if (value) {
    const rate = parseFloat(value);
    if (rate && rate % 1 === 0) return rate.toFixed(0);
    if (rate && rate % 1 !== 0) return rate.toFixed(1);
    return rate;
  }
  return value;
});

Vue.filter('date', (date) => {
  if (date) return moment.utc(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  return '';
});

Vue.filter('contact', (phone) => {
  if (phone) {
    const phoneNumber = String(phone);
    if (phoneNumber.length > 8) {
      return phoneNumber.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
    }
    return phoneNumber.replace(/(^0[0-9]{2}.{0}|^1.{3})(\d{4})/, '$1-$2');
  }
  return '';
});

Vue.filter('license', (license) => {
  if (license) return license.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  return '';
});

Vue.filter('sale', (sale) => {
  if (sale) return sale.replace(/(\d{4})([ㄱ-ㅎ|ㅏ-ㅣ|가-힣]){4}([0-9]{0,5})/, '제$1-$2-$3호');
  return '';
});

Vue.filter('lpad', (string, length, paddingString) => {
  let result = string.toString();
  const size = length - result.length;

  for (let i = 0; i < size; i += 1) {
    result = paddingString + result;
  }

  return result;
});

Vue.filter('rpad', (string, length, paddingString) => {
  let result = string.toString();
  const size = length - result.length;

  for (let i = 0; i < size; i += 1) {
    result += paddingString;
  }

  return result;
});
