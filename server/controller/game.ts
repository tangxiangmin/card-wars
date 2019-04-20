import {Context} from "koa";
import roomModel from '../model/room'
import Player from "../core/player";

import {userInfo} from '../model/user'

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
    async initRoomState(table: any, players: Array<userInfo>) {

        players.forEach((user: userInfo, index: number) => {
            let {cards, username, hp, id} = user
            let cardGroup = cards.split(',').map(id => parseInt(id, 10))

            // 第一轮的魔力值
            let startMp = index === 0 ? 3 : 4

            let player = table.getPlayerByUid(id)
            if (!player) {
                player = new Player(id, cardGroup, hp, startMp, username)
                table.addPlayer(player)
            }
        })

        // 第一个用户先出手
        let firstPlayer = table.getPlayerByUid(players[0].id)

        table.newRound(firstPlayer, firstPlayer)
    }
}
