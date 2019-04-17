/**
 * 2019/4/17 下午9:54
 */

import axios from 'axios'

export const login = ({account, password}) => {
    let url = '/login'
    return axios.post(url, {account, password})
}
