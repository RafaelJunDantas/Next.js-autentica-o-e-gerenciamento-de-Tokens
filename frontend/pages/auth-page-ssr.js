import { withSession } from "../src/services/auth/session";
import { tokenService } from "../src/services/auth/tokenService"
import nookies from 'nookies';

export default function AuthPageSSR(props) {

  return(
    <div>
      <h1>
        Auth Page SSR
      </h1>
      <p>
        <a href="/logout">Logout</a>
      </p>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  )
}

export const getServerSideProps = withSession((context) => {
  return {
    props: {
      session: context.req.session,
    }
  }
});

// export async function getServerSideProps(context) {
//   const cookies = nookies.get(context);
//   console.log(cookies);

//   try {
//     const session = await authService.getSession(context);
  
//     return {
//       props: {
//         session,
//       },
//     }
//   } catch (err) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/?error=401',
//       }
//     }
//   }
// }
