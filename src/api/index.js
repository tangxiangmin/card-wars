/**
 * 2019/4/17 下午9:54
 */

import axios from 'axios'
import auth from './auth'

axios.defaults.baseURL = '//localhost:3000/api'

axios.interceptors.request.use(
    config => {
        config.headers['X-Token'] = auth.getToken()

        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    res => {

        if (res && res.status === 200) {
            return res.data;
        }
    },
    err => {
        return Promise.reject(err);
    }
);

// 登录
export const login = ({account, password}) => {
    let url = '/login'

    return axios.post(url, {account, password}).then(res => {
        let {uid, token} = res.data

        if (token) {
            auth.setToken(token)
        }

        return token
    })
}
// 获取玩家基础信息
export const getUserInfo = () => {
    let url = '/userInfo'
    return axios.get(url)
}
