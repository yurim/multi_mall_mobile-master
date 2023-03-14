export default {
  getData(query) {
    return new Promise((resolve) => {
      let items = this.getDesserts();
      const total = items.length;

      if (query.sort_name && query.sort_type) {
        items = items.sort((a, b) => {
          const sortA = a[query.sort_name];
          const sortB = b[query.sort_name];

          if (query.sort_type === 'desc') {
            if (sortA < sortB) { return 1; }
            if (sortA > sortB) { return -1; }
            return 0;
          }
          if (sortA < sortB) { return -1; }
          if (sortA > sortB) { return 1; }
          return 0;
        });
      }

      items = items.slice((query.page - 1) * query.itemsPerPage, query.page * query.itemsPerPage);

      setTimeout(() => {
        resolve({
          items,
          total,
        });
      }, 1200);
    });
  },
  getDesserts() {
    const url = 'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_286/84-%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg';
    return [
      {
        name: 'Frozen Yogurt',
        url,
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%',
      },
      {
        name: 'Ice cream sandwich',
        url,
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%',
      },
      {
        name: 'Eclair',
        url,
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%',
      },
      {
        name: 'Cupcake',
        url,
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: '8%',
      },
      {
        name: 'Gingerbread',
        url,
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: '16%',
      },
      {
        name: 'Jelly bean',
        url,
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: '0%',
      },
      {
        name: 'Lollipop',
        url,
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: '2%',
      },
      {
        name: 'Honeycomb',
        url,
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: '45%',
      },
      {
        name: 'Donut',
        url,
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: '22%',
      },
      {
        name: 'KitKat',
        url,
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: '6%',
      },
    ];
  },
};
