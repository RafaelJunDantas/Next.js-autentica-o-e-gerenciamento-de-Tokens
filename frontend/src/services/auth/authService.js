import { httpClient } from "../../infra/httpClient/httpClient";
import { tokenService } from "./tokenService";

export const authService = {
  async login({ username, password }) {
    return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      body: { username,password }
    })
    // tratamento do access token
    .then(async (res) => {
      if(!res.ok) throw new Error('Usuário ou senha inválidos!');

      const body = res.body;
      //console.log(body);
      tokenService.save(body.data.access_token);

      return body;
    })
    // tratamento do refresh token
    .then(async ({ data }) => {
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
  async getSession(context) {
    const token = tokenService.get(context);

    return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      if(!res.ok) throw new Error('Não autorizado');
      
      return res.body.data;
    });
  },
};


