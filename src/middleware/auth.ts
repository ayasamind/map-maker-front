import nookies from 'nookies';
import { GetServerSideProps } from 'next';

export function requireAuthentication<P>(handler: GetServerSideProps<{}>) {
  return async (context: any) => {
    const { req, res } = context;
    const cookies = nookies.get(context);

    if (!cookies.authToken) {
      res.writeHead(302, { Location: '/users/signin' });
      res.end();
      return { props: {} };
    }

    return handler(context);
  };
}