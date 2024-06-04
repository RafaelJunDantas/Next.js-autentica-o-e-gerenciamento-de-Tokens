import { tokenService } from "../src/services/auth/tokenService"
import nookies from 'nookies';

export default function AuthPageSSR(props) {

  return(
    <div>
      <h1>
        Auth Page SSR
      </h1>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  console.log(cookies);

  return {
    props: {
      token: tokenService.get(context),
    },
  }
}
