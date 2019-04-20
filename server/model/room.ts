let rooms: any = new Map()
const numPerRoom: number = 2;

export default {
    // 新增房间
    addNewRoom(roomId: string) {
        rooms[roomId] = []
    },
    deleteRoom(roomId: string) {
        delete rooms[roomId]
    },
    // 返回一个新的房间
    getAwaitingRoom(): string {
        for (let roomId in rooms) {
            if (rooms.hasOwnProperty(roomId)) {
                if (this.getRoomUsers(roomId).length < numPerRoom) {
                    return roomId
                }
            }
        }
        return null
    },
    addUserToRoom(roomId: string, user: any) {
        let room = rooms[roomId]
        if (!room) {
            throw new Error(`roomId:${roomId}房间不存在`)
        }
        if (this.getRoomUsers(roomId).length > numPerRoom) {
            throw new Error(`roomId:${roomId}房间人数超过最大限制：${numPerRoom}`)
        }

        let hasUser = room.map((user: any) => user.uid).includes(user.uid)

        if (!hasUser) {
            room.push(user)
        }
    },
    getRoomUsers(roomId: string) {
        return rooms[roomId]
    }
}
