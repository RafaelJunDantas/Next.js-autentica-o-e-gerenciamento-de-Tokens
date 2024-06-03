import React from 'react';
import { useRouter } from 'next/router';
import { authService } from '../src/services/auth/authService';

export default function HomeScreen() {

  const router = useRouter();

  const [values, setValues] = React.useState({
    usuario: 'rafaeldantas',
    senha: 'safepassword',
  });

  function handleChange(event){
    const fieldValue = event.target.value;
    const fieldName = event.target.name;

    setValues((currentValue) => {
      return{
        ...currentValue,
        [fieldName]: fieldValue,
      }
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(event) => {
        // onSUmbit    -> Controller (pega dados do usuário e passa par um serviço)
        // authService -> Serviço
        event.preventDefault();
        authService
        .login({
          username: values.usuario,
          password: values.senha,
        })
        .then(() => {
          //router.push('/auth-page-static');
          router.push('/auth-page-ssr');
        })
        .catch(() => {
          alert('Usuário ou senha inválidos')
        });
      }}>
        <input
          placeholder="Usuário" name="usuario"
          value={values.usuario} onChange={handleChange}
        />
        <input
          placeholder="Senha" name="senha" type="password"
          value={values.senha} onChange={handleChange}
        />
        {/* <pre>
          {JSON.stringify(values, null, 2)}
        </pre> */}
        <div>
          <button>
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
