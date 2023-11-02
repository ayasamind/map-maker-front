import axios from "@/libs/axios";
import { useContext, useEffect } from "react";
// import useRefreshToken from "./useRefreshToken";
import { Auth } from "@/contexts/AuthContext";

const useAuthAxios = () => {
  // const refresh = useRefreshToken();
  const { auth } = useContext(Auth);


  useEffect(() => {
    // リクエスト前に実行。headerに認証情報を付与する
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // レスポンスを受け取った直後に実行。もし認証エラーだった場合、再度リクエストする。
    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // 403認証エラー(headerにaccess_tokenがない。もしくはaccess_tokenが無効)
        if (error?.response?.status === 403 && !prevRequest.sent) {
        //   prevRequest.sent = true;
        //   // 新しくaccess_tokenを発行する
        //   const newAccessToken = await refresh();
        //   prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        //   // 再度実行する
        //   return authAxios(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // 離脱するときにejectする
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return axios;
};

export default useAuthAxios;