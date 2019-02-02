/**
 * 2019/1/27 上午11:54
 */

module.exports = {
    getUserInfo(uid) {
        let map = {
            1: {
                cards: [1, 2],
                userName: 'PlayerA'
            },
            2: {
                cards: [1, 2],
                userName: 'PlayerB'
            }
        }
        return map[uid] || []
    }
}
