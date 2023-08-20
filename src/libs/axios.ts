import Axios, { AxiosError }  from 'axios'

const axios = Axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
        // 認証ができたら追記する
        // Authorization: `Bearer ${process.env.API_TOKEN}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
    responseType: 'json',
    // 認証ができたら記述する
    // withCredentials: true,
})

axios.interceptors.response.use(
    (response) => response, // 成功時の処理 
    (error) => { // エラー時の処理
      switch (error.response?.status) {
        case 422:  
          return Promise.reject(error.response?.data);
        case 404:
          return Promise.reject(error);
        case 500:
          return Promise.reject(error.response?.data);
        default:
          return Promise.reject(error.response?.data);
      }
    }
  );

export default axios