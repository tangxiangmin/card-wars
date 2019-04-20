import * as chai from 'chai'

import Player from '../server/core/player'
import {userA, userB} from "./mock";
import Table, {TableCell} from "../server/core/table";
import Card from "../server/core/card";

let assert = chai.assert


describe('class Player', () => {
    let readyTable: Table
    let playerA: Player
    beforeEach(function () {
        readyTable = new Table()
        let users = [userA, userB]
        readyTable.initPlayer(users)

        playerA = readyTable.getPlayerByUid(userA.id)

    });

    it('check env: should pass 100%', () => {
        assert(1 + 1 == 2)
    })

    context('player.getFarthestBound', () => {
        it('初始状态下只能在从上往下最后一行放置', () => {
            let playerA = readyTable.getPlayerByUid(userA.id)
            let distance = playerA.getFarthestBound()

            assert(distance === readyTable.row - 1)
        })
    })

    context('player.throwCard', () => {
        it('牌存在，则应当从手中的卡牌列表中丢弃指定的牌', () => {
            let cards = playerA.currentCards
            let card = cards[0]
            let targetCard = playerA.throwCard(card)

            assert(card == targetCard)
            assert(cards.indexOf(targetCard) === -1)
        })
    })
    context('player.randomThrowCard', () => {
        it('应当从手中的卡牌列表中随机丢弃一张', () => {
            let originLength = playerA.currentCards.length

            let card = playerA.randomThrowCard()

            assert(playerA.currentCards.indexOf(card) === -1)
            assert(originLength === playerA.currentCards.length + 1)
        })
    })

    context('player.drawCards', () => {
        it('初始状态下应随机抽满牌', () => {
            assert(playerA.maxCardNum === playerA.currentCards.length)
        })
        it('每次抽牌应补全玩家手中卡牌数量', () => {
            playerA.randomThrowCard()

            playerA.drawCards()
            assert(playerA.maxCardNum === playerA.currentCards.length)
        })

        // // todo
        // it('玩家不会同时抽到两张相同的牌', () => {
        // })
        // // todo
        // it('玩家不会连续抽到相同的牌', () => {
        // })
    })
    context('player.checkPosAvailable', () => {
        it('初始状态下只有从上往下最后一排cell可用', () => {
            let lastRow = readyTable.row - 1

            readyTable._walkCells((cell: TableCell) => {
                let pos = cell.pos
                let row = pos[0]
                let available = playerA.checkPosAvailable(pos)
                let isLastRow = row == lastRow

                assert(available == isLastRow)
            })
        })
    })
    context('player.putCardToTable', () => {
        let pos: number[]
        let currentPlayer: Player

        beforeEach(function () {
            readyTable.startGame()
            pos = [readyTable.row - 1, 0]
            currentPlayer = readyTable.currentPlayer
        })

        it('蓝量不足时，应该抛出异常', () => {
            let currentPlayer = readyTable.currentPlayer
            currentPlayer.mp = 0

            let pickCard = currentPlayer.currentCards[0]

            assert.throw(() => {
                currentPlayer.putCardToTable(pickCard, pos)
            })
        })
        it('非当前选手的回合时，应该抛出异常', () => {
            let rivalPlayer = readyTable.getPlayerRival()
            rivalPlayer.mp = Infinity

            let pickCard = rivalPlayer.currentCards[0]
            assert.throw(() => {
                rivalPlayer.putCardToTable(pickCard, pos)
            })
        })

        it('蓝量足够且目标cell有效时，可以卡牌放置在目标cell上', () => {
            currentPlayer.mp = Infinity

            let pickCard = currentPlayer.currentCards[0]

            assert.doesNotThrow(() => {
                currentPlayer.putCardToTable(pickCard, pos)
            })
        })
    })
})
