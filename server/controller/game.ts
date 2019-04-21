import {Context} from "koa";
import roomModel from '../model/room'

import Table, {userInfo} from "../core/table";

export default {
    async createRoom(ctx: Context) {
        // todo 用户重连机制
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
    // 初始化房间内容
    async initRoom(players: Array<userInfo>) {
        let table = new Table()
        table.initPlayer(players)

        table.startGame()
        return table
    }
}
