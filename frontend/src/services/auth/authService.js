import { httpClient } from "../../infra/httpClient/httpClient";
import { tokenService } from "./tokenService";

export const authService = {
  async login({ username, password }) {
    return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      body: { username, password }
    })
    .then(async (res) => { // tratamento do access token
      if(!res.ok) throw new Error('Usuário ou senha inválidos!');

      const body = res.body;
      //console.log(body);
      tokenService.save(body.data.access_token);

      return body;
    })
    .then(async ({ data }) => { // tratamento do refresh token
      const { refresh_token } = data;
      //console.log(refresh_token);

      const res = await httpClient('/api/refresh', {
        method: 'POST',
        body: {
          refresh_token,
        },
      })
      console.log(res);
    })
  },
  async getSession(ctx = null) {
    const token = tokenService.get(ctx);

    return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      ctx,
      refresh: true,
    })
    .then((res) => {
      if(!res.ok) throw new Error('Não autorizado');
      
      return res.body.data;
    });
  },
};


