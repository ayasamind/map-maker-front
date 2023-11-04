import axios from "@/libs/axios";
import nookies from 'nookies';
import { GetServerSidePropsResult } from 'next';

const authAxios = (context: any) => {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return axios;
  }
  axios.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${cookies.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  )
  return axios;
};

const errorHandler = (error: any): GetServerSidePropsResult<{}> => {
  if (error.response && error.response.status === 404) {
    return { notFound: true };
  }
  if (error.response && error.response.status === 401) {
    return {
      redirect: {
        destination: '/users/signin',
        permanent: false,
      },
    }
  };
  throw error;
}

export { authAxios, errorHandler };