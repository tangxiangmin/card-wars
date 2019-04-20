import {Context} from "koa";
import roomModel from '../model/room'

export default {

    async createRoom(ctx: Context) {
        // 首先查询是否有正在等待中的房间号
        let waitingRoomId = await roomModel.getAwaitingRoom()
        // 如不存在，则新建一个房间并返回
        if (!waitingRoomId) {
            waitingRoomId = Math.random().toString(36).substr(2);
            await roomModel.addNewRoom(waitingRoomId)
        }

        ctx.body = {
            message: 'success',
            data: {
                roomId: waitingRoomId
            }
        }
    },
}
