/**
 * 2019/1/21 下午5:59
 */
import cardsFactory from './cards'

class CardFactory {
    constructor(cardGroup) {
        this.cardGroup = cardGroup // 拥有的牌组
    }

    // 随机生成times张牌
    drawCards(player, times) {
        let randomCards = this.cardGroup.sort(() => {
            return .5 - Math.random();
        }).slice(0, times).map(cardId => {
            let card = cardsFactory.createCardById(cardId)
            card.setPlayer(player)
            return card
        })

        return randomCards
    }
}

class Player {
    constructor({uid, cardGroup, startMp, hp, userName}) {
        this.uid = uid
        this.userName = userName
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

    // 获取最远可移动的距离
    getFarthestBound() {
        let table = this.table
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
        let cards = this.cardFactory.drawCards(this, leftNum)
        this.currentCards = this.currentCards.concat(cards)
    }

    // 检测该单元格是否可放置
    checkPosAvailable(pos) {
        let table = this.table
        let cell = table.getCellByPos(pos)
        let [row] = pos
        // 单元格未空，且在当前可移动范围内
        return cell.isEmpty() && this.getFarthestBound() <= row
    }

    // 放牌
    putCardToTable(card, pos) {
        let errorMsg = ''
        let table = this.table

        if (!table) {
            errorMsg = '未加入游戏'
        } else if (table.currentPlayer !== this) {
            errorMsg = '非当前选手的回合，无法放牌'
        } else if (this.checkPosAvailable(pos)) {
            if (this.mp >= card.cost) {
                table.putCard(card, pos)
                this.mp -= card.cost

                let index = this.currentCards.indexOf(card)
                this.currentCards.splice(index, 1)

            } else {
                errorMsg = 'Player: 蓝量不足'
            }
        } else {
            errorMsg = 'Player: 当前位置无法放置'
        }

        return errorMsg
    }

    // 遭受卡牌攻击
    underAttack(card) {
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
