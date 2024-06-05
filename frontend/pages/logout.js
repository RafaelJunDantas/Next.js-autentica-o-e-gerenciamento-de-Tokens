import { useRouter } from 'next/router';
import { tokenService } from '../src/services/auth/tokenService'
import React from 'react';
import { httpClient } from '../src/infra/httpClient/httpClient';

export default function logoutPage() {

  const router = useRouter();

  React.useEffect(async () => {
    try {
      await httpClient('/api/refresh', {
        method: 'DELETE',
      });
      tokenService.delete();
      router.push('/');
    } catch(err) {
      alert(err.message);
    }
  }, []);

  return (
    <div>
      Redirecionando...
    </div>
  )
}
