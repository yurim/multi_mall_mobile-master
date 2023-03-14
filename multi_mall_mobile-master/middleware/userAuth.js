import Utils from '~/plugins/utils';

// eslint-disable-next-line func-names
export default function ({ req, redirect }) {
  let cookie;
  if (process.server) cookie = req.headers.cookie;
  else cookie = document.cookie;

  const userId = Utils.getUserId(cookie);
  const userGrade = Utils.getUserGrade(cookie);
  if (!userId || userGrade !== '0') return redirect('/user/login');
}
