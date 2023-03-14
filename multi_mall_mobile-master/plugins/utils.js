const atob = (str) => Buffer.from(str, 'base64').toString('binary');

const addCookie = (key, value, expires) => {
  if (typeof document === 'undefined') return;
  if (expires) {
    const data = new Date(Date.now() + expires);
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${data.toUTCString()}; path=/;`;
  } else {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/;`;
  }
};

const getCookie = (cookie, key) => {
  if (!cookie) return null;
  const regExp = new RegExp(`(?:^|; )${encodeURIComponent(key).replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`);
  const matches = cookie.match(regExp);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const removeCookie = (key) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${key}=; expires=-1; path=/;`;
};

const getUserId = (cookie) => {
  let userId;
  const jwt = getCookie(cookie, 'jwt');
  if (jwt) {
    const info = JSON.parse(atob(jwt.split('.')[1]));
    const grade = parseInt(info.info.split('_')[1], 10);
    if (grade === 0) userId = info.info.split('_')[0];
  }
  return userId;
};

const getStoreId = (cookie) => {
  let storeId;
  const jwt = getCookie(cookie, 'jwt');
  if (jwt) {
    const info = JSON.parse(atob(jwt.split('.')[1]));
    storeId = info.info.split('_')[2];
  }
  return storeId;
};

const getUserGrade = (cookie) => {
  let userGrade;
  const jwt = getCookie(cookie, 'jwt');
  if (jwt) {
    const info = JSON.parse(atob(jwt.split('.')[1]));
    userGrade = info.info.split('_')[1];
  }
  return userGrade;
};

export default {
  atob,
  addCookie,
  getCookie,
  removeCookie,
  getUserId,
  getStoreId,
  getUserGrade,
};
