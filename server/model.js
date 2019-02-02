/**
 * 2019/1/27 上午11:54
 */

let room = {}
module.exports = {
    getUserInfo(uid) {
        let map = {
            1: {
                uid: 1,
                hp: 9,
                cards: [1, 2, 3, 4, 5, 6,],
                userName: 'PlayerA'
            },
            2: {
                uid: 2,
                hp: 12,
                cards: [1, 2, 3, 4, 5, 6,],
                userName: 'PlayerB'
            }
        }
        return map[uid]
    },
    addRoomPlayer(roomId, user) {
        if (!roomId) {
            throw `${roomId}房间号不存在`
        }
        if (!user) {
            throw `addRoomPlayer用户不存在${roomId}`
        }

        let maxNum = 2 // 房间最大人数
        let personGroup = room[roomId]
        if (!personGroup) {
            room[roomId] = [user]
        } else {
            // 用户已在对应房间时，则不再加入
            let inRoom = personGroup.filter(item => {
                return item.uid === user.uid
            }).length > 0

            if (!inRoom) {
                if (personGroup.length < maxNum) {
                    personGroup.push(user)
                } else {
                    throw `${roomId}房间人数已超过两人，无法继续加入，personGroup：${JSON.stringify(personGroup)}`
                }
            }
        }
    },
    getRoomPlayers(roomId) {
        return room[roomId]
    }
}
