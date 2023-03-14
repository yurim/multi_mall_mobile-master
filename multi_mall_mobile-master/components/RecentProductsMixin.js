import _ from 'lodash';

export default {
  mounted() {
    // 최근 본 상품에 현재 상품 추가
    let recentProducts = JSON.parse(sessionStorage.getItem('recentProducts'));
    if (!recentProducts) recentProducts = [];

    const currProduct = {
      _id: this.product._id,
      imageUrl: this.product.main_image,
      linkUrl: `/product/${this.product._id}`,
    };
    recentProducts.unshift(currProduct);
    recentProducts = _.uniqBy(recentProducts, '_id');
    if (recentProducts.length > 6) recentProducts.pop();

    sessionStorage.setItem('recentProducts', JSON.stringify(recentProducts));
  },
};
