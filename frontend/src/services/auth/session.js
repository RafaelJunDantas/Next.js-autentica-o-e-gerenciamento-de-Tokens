import { authService } from "./authService";

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
