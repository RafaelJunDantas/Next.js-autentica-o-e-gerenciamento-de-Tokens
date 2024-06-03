import { httpClient } from "../../infra/httpClient/httpClient";

export const authService = {
  async login({ username, password }) {
    return httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      body: { username,password }
    })
    .then(async (res) => {
      if(!res.ok) throw new Error('Usuário ou senha inválidos!');
      const body = res.body;
      console.log(body);
    })
  }
};
