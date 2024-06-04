// Arquitetura hexagonal
// Ports e Adapters

import { tokenService } from "../../services/auth/tokenService";

export async function httpClient(fetchURL, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
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
      
      // tentativa de atualizar os tokens
      const refreshRes = await httpClient(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/refresh`, {
        method: 'GET',
      });
      console.log(refreshRes.body.data);
      const newAccessToken = refreshRes.body.data.access_token;
      const newRefreshToken = refreshRes.body.data.refresh_token;

      // guarda os tokens
      tokenService.save(newAccessToken);

      // tentativa de rodar o request anterior
      const retryRes = await httpClient(fetchURL, {
        ...options,
        refresh: false,
        headers: {
          'Authorization' : `Bearer ${newAccessToken}`,
        }
      });

      return res;
    });
}
