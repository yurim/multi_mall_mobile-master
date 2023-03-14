export default {
  // groupBy
  // field 값이 같은 요소들 끼리 배열로 묶어 주는 함수
  // example)
  // groupBy(
  //  [
  //   {product_id: 1, name: 'product_name1'},
  //   {product_id: 2, name: 'product_name2'},
  //   {product_id: 2, name: 'product_name3'},
  //   {product_id: 3, name: 'product_name4'}
  //  ],
  //  'product_id'
  // )
  // result) [
  //  [{product_id: 1, name: 'product_name1'}],
  //  [{product_id: 2, name: 'product_name2'}, {product_id: 2, name: 'product_name3'}],
  //  [{product_id: 3, name: 'product_name4'}],
  // ]
  groupBy(list, field) {
    const groupArray = [];
    const groupMap = {};
    list.forEach((item) => {
      if (Array.isArray(item)) {
        groupArray.push(this.groupBy(item, field));
      } else {
        const fieldValue = item[field];
        if (!fieldValue || fieldValue.length === 0) {
          if (!groupMap[item.product_id]) groupMap[item.product_id] = [];
          groupMap[item.product_id].push(item);
        } else {
          if (!groupMap[item[field]]) groupMap[item[field]] = [];
          groupMap[item[field]].push(item);
        }
      }
    });
    Object.values(groupMap).forEach((v) => {
      groupArray.push(v);
    });
    return groupArray;
  },
  getFirstObject(group) {
    let result;
    if (Array.isArray(group)) {
      const flatList = group.flat(Infinity);
      if (flatList.length > 0) result = flatList[0];
    } else {
      result = group;
    }

    return result;
  },
  getProductPrice(cart) {
    let price = cart.product_info.discount_price ? cart.product_info.discount_price : cart.product_info.price;
    if (cart.option_info) price += cart.option_info.additional_price;
    return price;
  },
  /**
   * 단일 cart 배송비 계산
   * @param cart
   * @param totalProductPrice 그룹 내 상품 총 금액
   * @param totalQuantity 그룹 내 상품 총 수량
   * @returns {number}
   */
  getCartDeliveryPrice(cart, totalProductPrice, totalQuantity) {
    let price = 0;
    const deliveryInfo = cart.delivery_info;
    switch (deliveryInfo.delivery_fee_type) {
      case 'FREE':
        // 무료
        break;
      case 'CHARGE':
        // 유료 - 기본 배송비 부과
        price += deliveryInfo.default_fee;
        break;
      case 'CNDTN':
        // 조건부 무료 - condition_value 원 이상 무료
        if (totalProductPrice < deliveryInfo.condition_value) price += deliveryInfo.default_fee;
        break;
      case 'AMOUNT':
        // 수량별 - condition_value 개 마다 기본 배송비 반복 부과
        price += Math.ceil(totalQuantity / deliveryInfo.condition_value) * deliveryInfo.default_fee;
        break;
      case 'AREA':
        // 구간별 - condition_value 개 까지 추가 배송비 없음
        price += deliveryInfo.default_fee;
        if (totalQuantity > deliveryInfo.condition_value) price += deliveryInfo.additional_fee;
        break;
      default:
        break;
    }

    return price;
  },
  // 묶음 배송 그룹의 '상품 가격, '배송비' init
  setDeliveryGroupPrices(storeGroupList, checkSelected, isJeju, isCountryMountain) {
    const deliveryGroupList = storeGroupList.flat(1);
    deliveryGroupList.forEach((group) => {
      const firstCart = this.getFirstObject(group);
      const deliveryGroup = firstCart.delivery_group;
      const carts = group.flat(Infinity);

      let totalProductPrice = 0;
      let deliveryPrice = 0;
      let totalQuantity = 0;
      let savingPoint = 0;

      carts.forEach((cart) => {
        if (checkSelected && !cart.isChecked) return;
        // 상품 총 가격(상품 가격 * 상품 개수)
        const productTotalPrice = this.getProductPrice(cart) * cart.amount;
        totalProductPrice += productTotalPrice;

        // 구매 적립 포인트
        savingPoint += Math.floor((productTotalPrice * cart.product_info.saving_rate) / 100);

        // 상품 총 개수
        totalQuantity += cart.amount;
      });

      carts.forEach((cart) => {
        if (checkSelected && !cart.isChecked) return;
        // 배송비
        let cartDeliveryPrice = this.getCartDeliveryPrice(cart, totalProductPrice, totalQuantity);
        if (cart.country_mountain_deliveries && cart.country_mountain_deliveries.length > 0) {
          let existCmd;
          cart.country_mountain_deliveries.forEach((v) => {
            if ((v.area_type === 'TOTAL' && (isJeju || isCountryMountain))
              || (v.area_type === 'JEJU' && isJeju)
              || (v.area_type === 'CNTRY_MNTN' && isCountryMountain)) {
              existCmd = v;
            }
          });
          if (existCmd) cartDeliveryPrice += existCmd.additional_price;
        }
        if (deliveryGroup) {
          // 묶음 배송비 계산
          if (!deliveryPrice) deliveryPrice = cartDeliveryPrice;
          if (deliveryGroup.is_smaller) {
            deliveryPrice = deliveryPrice > cartDeliveryPrice ? cartDeliveryPrice : deliveryPrice;
          } else {
            deliveryPrice = deliveryPrice < cartDeliveryPrice ? cartDeliveryPrice : deliveryPrice;
          }
        } else {
          // 단일 cart 배송비 계산
          deliveryPrice = cartDeliveryPrice;
        }
      });

      firstCart.productPrice = totalProductPrice;
      firstCart.deliveryPrice = deliveryPrice;
      firstCart.totalPrice = totalProductPrice;
      if (firstCart.delivery_info.fee_pay_method !== 'CSH_DLVRY') firstCart.totalPrice += deliveryPrice; // 선불 배송비 연산
      firstCart.quantity = totalQuantity;
      firstCart.savingPoint = savingPoint;
    });

    return storeGroupList;
  },
};
