import * as chai from 'chai'
import Table from "../server/core/table";

let assert = chai.assert
import {userA, userB} from "./mock";

describe.skip('class Table', () => {

    let readyTable: Table
    beforeEach(function () {
        readyTable = new Table()
        let users = [userA, userB]
        readyTable.initPlayer(users)
    });

    it('check env: should pass 100%', () => {
        assert(1 + 1 == 2)
    })
    context('table.constructor', () => {
        it('初始化table时默认宽高为4', () => {
            let table = new Table()

            assert(table.row == 4)
            assert(table.col == 4)
        })
        it('初始化table时默认players为空', () => {
            let table = new Table()
            assert(table.players)
            assert(table.players.length == 0)
        })
    })

    context('table._walkCells', () => {
        it('_walkCells应该遍历所有的表格', () => {
            let count = 0
            let table = new Table()
            table._walkCells(() => {
                count++
            })
            assert(count === table.row * table.col)

        })
    })

    context('table.initPlayer', () => {
        let table = new Table()

        it('初始化users小于2人时应该抛出错误', () => {
            let users = [userA]
            assert.throws(() => {
                table.initPlayer(users)
            });
        })
        it('初始化users大于2人时应该抛出错误', () => {
            let users2 = [userA, userB, userA]
            assert.throws(() => {
                table.initPlayer(users2)
            });
        })
    })
    context('table.getPlayerByUid', () => {
        it('当玩家存在时，可以根据uid获得', () => {
            let uid = userA.id
            let player = readyTable.getPlayerByUid(uid)

            assert(player)
            assert(player._userInfo == userA)
        })
        it('当玩家不存在时，应该返回undefined', () => {
            let uid = 100
            let player = readyTable.getPlayerByUid(uid)
            assert(player == undefined)
        })
    })

    context('table.startGame', () => {
        it('房间人数小于2人应该抛出错误', () => {
            let table = new Table()

            assert.throws(() => {
                table.startGame()
            });

        });
        it('table.players[0]应该第一局先手', () => {
            let table = readyTable

            table.startGame()

            assert(table.currentPlayer)

            assert(table.currentPlayer._userInfo == userA)
        })
    })

    context('table.putCard', () => {
        // todo 更新玩家可放置区域
        // 触发card钩子函数
        // 更新tableCell
        // 跟新玩家卡牌
    })
})

