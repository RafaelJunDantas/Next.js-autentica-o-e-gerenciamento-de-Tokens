// Arquitetura hexagonal
// Ports e Adapters

import nookies from 'nookies';
import { tokenService } from "../../services/auth/tokenService";

export async function httpClient(fetchURL, fetchOptions = {}) {
  const defaultHeaders = fetchOptions.headers || {}
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };

  return fetch(fetchURL, options)
    .then(async (res) => {
      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        body: await res.json(),
      }
    })
    .then(async (res) => {
      if(!fetchOptions.refresh || res.status !== 401) return res;

      console.log(req)

      const isServer = Boolean(fetchOptions?.context);  
      const currentRefreshToken = fetchOptions?.context?.req?.cookies['refresh_token_key'];
      
      try {
        // tentativa de atualizar os tokens 
        // `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/refresh`
        const refreshRes = await httpClient('https://localhost:3000/api/refresh', {
          method: isServer ? 'PUT' : 'GET',
          body: isServer ? { refresh_token: currentRefreshToken } : undefined,
        });

        console.log('refreshRes: ', refreshRes)

        const newAccessToken = refreshRes.body.data.access_token;
        const newRefreshToken = refreshRes.body.data.refresh_token;

        // guarda os tokens
        if(isServer) {
          nookies.set(ctx, 'refresh_token_key', newRefreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
          })
        }

        tokenService.save(newAccessToken);

        // tentativa de rodar o request anterior
        const retryRes = await httpClient(fetchURL, {
          ...options,
          refresh: false,
          headers: {
            'Authorization' : `Bearer ${newAccessToken}`,
          }
        });
        return retryRes;
      }catch(err) {
        console.error(err);
        return res;
      }
    });
}
