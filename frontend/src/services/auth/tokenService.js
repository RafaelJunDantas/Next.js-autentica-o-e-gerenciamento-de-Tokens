import nookies from 'nookies'

const ACCESS_TOKEN_KEY = 'access_token_key';

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

export const tokenService = {
  save(accessToken, context = null) {
    globalThis?.localStorage?.setItem(ACCESS_TOKEN_KEY, accessToken);
    //globalThis?.sessionStorage?.setItem(ACCESS_TOKEN_KEY, accessToken);
    nookies.set(context, ACCESS_TOKEN_KEY, accessToken, {
      maxAge: ONE_DAY,
      path: '/',
    });
  },
  get(context = null) {
    const cookies = nookies.get(context);
    return cookies[ACCESS_TOKEN_KEY] || '';
    //return globalThis?.localStorage?.getItem(ACCESS_TOKEN_KEY);
    //return globalThis?.sessionStorage?.getItem(ACCESS_TOKEN_KEY);
  },
  delete(context = null) {
    globalThis?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
    //globalThis?.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    nookies.destroy(context, ACCESS_TOKEN_KEY);
  }
}
