/**
 * 2019/1/21 下午5:59
 */

import cardModel from '../model/card'
import Card from "./card";
import Table, {userInfo} from "./table";

class CardFactory {
    cardGroup: number[]
    drawRecord: Card[] // todo 抽牌记录

    constructor(cardGroup: number[]) {
        this.cardGroup = cardGroup // 拥有的牌组
    }

    // 随机生成times张牌
    drawCards(player: Player, times: number) {
        return this.cardGroup.sort(() => {
            return .5 - Math.random();
        }).slice(0, times).map(cardId => {
            let card = cardModel.createCardById(cardId)
            card.setPlayer(player)
            return card
        })
    }
}

class Player {
    uid: number
    startMp: number
    hp: number
    username: string
    mp: number
    round: number
    table: Table
    maxCardNum: 4
    cardFactory: CardFactory
    currentCards: Array<Card>
    _userInfo: userInfo

    constructor(user: userInfo, startMp: number) {
        this._userInfo = user
        let {uid, username, hp, cardGroup} = this._fromUserInfo(user)

        this.uid = uid
        this.username = username
        this.hp = hp // 生命值
        this.startMp = startMp

        this.mp = this.startMp // 魔力值
        this.round = 0 // 第几回合

        this.table = null // 牌桌单例
        this.maxCardNum = 4

        this.cardFactory = new CardFactory(cardGroup)

        this.currentCards = [] // 当前手中的卡牌

        // 初始化操作
        this.drawCards()
    }

    _fromUserInfo(user: userInfo) {
        let {cards, username, hp, id} = user
        let cardGroup = cards.split(',').map(id => parseInt(id, 10))

        return {
            uid: id, cardGroup, hp, username: username
        }
    }

    // 获取最远可移动的距离
    getFarthestBound() {
        let table = this.table
        if (!table) {
            throw new Error('未加入任何游戏')
        }
        let tableCards = table.getPlayerCards(this)
        let firstCard = tableCards[0]

        if (firstCard) {
            let [row] = firstCard.pos
            return row
        }

        // 默认家门口的位置可放置
        return table.row - 1
    }

    // 抽牌，补充剩余的牌
    drawCards() {
        let leftNum = this.maxCardNum - this.currentCards.length

        if (leftNum > 0) {
            let cards = this.cardFactory.drawCards(this, leftNum)
            this.currentCards = this.currentCards.concat(cards)
        }
    }

    // 弃牌
    throwCard(card: Card) {
        let index = this.currentCards.indexOf(card)
        if (index > -1) {
            this.currentCards.splice(index, 1)
            return card
        }
    }

    // 随机弃牌
    randomThrowCard() {
        let len = this.currentCards.length
        let randomIndex = Math.floor(Math.random() * len)
        let card = this.currentCards[randomIndex]
        return this.throwCard(card)
    }

    // 检测玩家在某个单元格是否可放置
    checkPosAvailable(pos: number[]) {
        let table = this.table
        let cell = table.getCellByPos(pos)
        let [row] = pos
        // 单元格未空，且在当前可移动范围内
        return cell.isEmpty() && this.getFarthestBound() <= row
    }

    // 放牌
    putCardToTable(card: Card, pos: number[]) {
        let errorMsg = ''
        let table = this.table

        if (!table) {
            throw new Error('未加入游戏')
        } else if (table.currentPlayer !== this) {
            throw new Error('非当前选手的回合')
        } else if (this.checkPosAvailable(pos)) {
            if (this.mp >= card.cost) {
                table.putCard(card, pos)
                this.mp -= card.cost

                let index = this.currentCards.indexOf(card)
                this.currentCards.splice(index, 1)

            } else {
                throw new Error('mp值不足')
            }
        } else {
            throw new Error('当前位置无法放置')
        }

        return errorMsg
    }

    // 遭受卡牌攻击
    underAttack(card: Card) {
        this.hp -= card.hp
        card.afterDie()
    }

    // 新回合
    resetNewRound() {
        this.round++
        this.mp = this.startMp + this.round

        this.drawCards()
    }
}

export default Player
