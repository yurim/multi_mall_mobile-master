import Example from './Example';
import Alert from './PopAlert';
import Confirm from './PopConfirm';
import UserRegistCompleted from './PopUserRegistCompleted'; // 회원가입 완료 팝업
import Terms from './PopTerms'; // 약관 안내 팝업
import InquiryWrite from './PopInquiryWrite'; // 문의하기
import StoreInfo from './PopStoreInfo'; // 스토어 정보
import NonMemberOrderConfirm from './PopNonMemberOrderConfirm';
import ReviewShow from './PopReviewShow'; // 리뷰보기
import DeliveryAddressList from './PopDeliveryAddressList'; // 배송지 목록
import AddressModify from './PopAddressModify'; // 배송지변경
import LeaveReason from './PopLeaveReason'; // 회원 탈퇴 사유입력
import ReviewWrite from './PopReviewWrite'; // 리뷰작성
import DeliveryInfo from './PopDeliveryInfo'; // 배송정보

import RequestExchangeEdit from './PopRequestExchangeEdit'; // 교환신청수정
import RequestCancelEdit from './PopRequestCancelEdit'; // 취소신청수정
import RequestReturnEdit from './PopRequestReturnEdit'; // 반품수정

import RequestCancelDetail from './PopRequestCancelDetail'; // 취소신청상세
import RequestExchangeDetail from './PopRequestExchangeDetail'; // 교환신청상세정보
import RequestReturnDetail from './PopRequestReturnDetail'; // 반품신청상세정보

import DelayReason from './PopDelayReason'; // 반품신청상세정보

import PriceGroupImageSearch from './PopPriceGroupImageSearch'; // 이미지검색
import EventInfo from './PopEventInfo'; // 이벤트 공지 팝업

// require('./popup.scss');

require('@/assets/css/star_rate.scss');

export default {
  showAlertPopup: (message, closeCallback = () => {}) => {
    new Alert({
      propsData: {
        title: message,
        okCallback: ({ $destroy }) => $destroy(),
        closeCallback,
      },
    }).$mount();
  },
  Example,
  Alert,
  Confirm,
  UserRegistCompleted,
  Terms,
  InquiryWrite,
  StoreInfo,
  NonMemberOrderConfirm,
  ReviewShow,
  DeliveryAddressList,
  AddressModify,
  LeaveReason,
  ReviewWrite,
  DeliveryInfo,
  RequestExchangeEdit,
  RequestCancelEdit,
  RequestReturnEdit,
  RequestExchangeDetail,
  RequestReturnDetail,
  RequestCancelDetail,
  DelayReason,
  PriceGroupImageSearch,
  EventInfo,
};
