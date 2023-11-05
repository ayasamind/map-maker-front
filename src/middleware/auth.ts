import nookies from 'nookies';
import { GetServerSideProps } from 'next';

export function requireAuthentication<P>(handler: GetServerSideProps<{}>) {
  return async (context: any) => {
    const { req, res } = context;
    const cookies = nookies.get(context);
    if (!cookies.token) {
      res.writeHead(302, { Location: '/users/signin' });
      res.end();
      return { props: {} };
    }

    return handler(context);
  };
}

export function redirectIfAuthenticated<P>(handler: GetServerSideProps<{}>) {
  return async (context: any) => {
    const { req, res } = context;
    const cookies = nookies.get(context);

    if (cookies.token) {
      res.writeHead(302, { Location: '/users/mypage' });
      res.end();
      return { props: {} };
    }

    return handler(context);
  };
}