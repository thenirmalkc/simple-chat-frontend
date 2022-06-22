import { apiUrl } from '@constants/url';
import { actions as authActions } from '@store/auth';

async function fetchData(url, options, dispatch, action) {
  const fetchOptions = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    },
    body: JSON.stringify(options.body) || JSON.stringify({}),
    signal: options.signal
  };
  if (options.method === 'GET') {
    delete fetchOptions['Content-Type'];
    delete fetchOptions['body'];
  }
  const r1 = await fetch(url, fetchOptions);
  const s1 = r1.status;
  const j1 = await r1.json();
  if (s1 === 401) {
    const [s2, j2] = await refreshToken();
    if (s2 === 200) {
      window.localStorage.setItem('refreshToken', j2.refreshToken);
      window.localStorage.setItem('accessToken', j2.accessToken);
      dispatch(action({ body: options.body, signal: options.signal }));
    } else dispatch(authActions.apiLogout());
  }
  return [s1, j1];
}

async function refreshToken() {
  const res = await fetch(apiUrl.refreshToken, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('refreshToken') }
  });
  const { status } = res;
  const json = await res.json();
  return [status, json];
}

export default fetchData;
