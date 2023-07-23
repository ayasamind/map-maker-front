import Axios from 'axios'

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

export default axios