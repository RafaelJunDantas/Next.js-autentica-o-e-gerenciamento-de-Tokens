## Access Token
- **Para que serve?**
  - Pegar qualquer tipo de informação do usuário
  - Inserir informações
  - Atualizar informações
  - Deletar informações
- **Duração**
  - Dura pouco tempo ou o mínimo possível
- **Risco de vazamento**
  - Quanto maior o tempo de vida, maior o estrago

## Refresh Token
- **Para que serve?**
  - Gerar um novo access token, sem precisar de login e senha
- **Duração**
  - Duração longa
  - Em nível de backend, o refresh token está associado ao usuário
- **Risco de vazamento**
  - Gerar tokens infinitos, tanto access quanto refresh
