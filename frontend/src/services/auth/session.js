import { authService } from "./authService";
import React from 'react';
import { useRouter } from 'next/router';

// SSR
export function withSession(func) {
  return async (context) => {
    try {
      const session = await authService.getSession(context);
      const modifiedContext = {
        ...context,
        req: {
          ...context.req,
          session,
        }
      }
      return func(modifiedContext);
    } catch(err) {
      return {
        redirect: {
          permanent: false,
          destination: '/?error=401',
        }
      }
    }
  }
}

// SSG
export function useSession() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState(null);

  React.useEffect(() => {
    authService.getSession()
      .then((userSession) => {
        //console.log(userSession);
        setSession(userSession);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  return {
    data: {
      session,
    },
    loading,
    error,
  }
}

export function withSessionHOC(Component) {
  return function Wrapper(props) {
    const router = useRouter();
    const session = useSession();
    console.log(session);

    if(!session.loading && session.error){
      console.log("Redireciona para Home");
      router.push('/?error=401');
    }

    const modifiedProps = {
      ...props,
      session: session.data.session,
    }
    return (
      <Component {...modifiedProps}/>
    )
  }
}
