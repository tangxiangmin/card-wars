/**
 * 2019/4/18 下午9:32
 */

const auth = {
    KEY: 'auth_token',
    token: '',
    setToken(token) {
        this.token = token
        localStorage.setItem(this.KEY, token)
    },
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem(this.KEY)
        }
        return this.token
    }
}

export default auth
