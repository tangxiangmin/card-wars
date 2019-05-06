import Table from "../../core/table";

let rooms: any = new Map()
const numPerRoom: number = 2;

export default {
    // 新增房间
    addNewRoom(roomId: string) {
        rooms[roomId] = {
            users: [],
            table: null
        }
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

        let users = this.getRoomUsers(roomId)
        if (users.length > numPerRoom) {
            throw new Error(`roomId:${roomId}房间人数超过最大限制：${numPerRoom}`)
        }

        let hasUser = users.map((user: any) => user.id).includes(user.id)

        if (!hasUser) {
            users.push(user)
        }
    },
    getRoomUsers(roomId: string) {
        return rooms[roomId].users
    },
    setRoomTable(roomId: string, table: Table) {
        rooms[roomId].table = table
    },
    getRoomTable(roomId: string) {
        return rooms[roomId].table
    }
}
