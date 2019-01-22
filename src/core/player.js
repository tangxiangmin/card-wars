/**
 * 2019/1/21 下午5:59
 */

class CardFactory {
    constructor(cardGroup) {
        this.cardGroup = cardGroup // 拥有的牌组
    }

    // 随机生成times张牌
    drawCards(times) {
        return this.cardGroup.sort(() => {
            return .5 - Math.random();
        }).slice(0, times)
    }
}

class Player {
    constructor({cardGroup}) {
        this.hp = 10 // 生命值
        this.mp = 3 // 魔力值

        this.currentCards = [] // 当前手中的卡牌
        this.table = null // 牌桌单例
        this.maxCardNum = 4

        this.cardFactory = new CardFactory(cardGroup)
    }

    // 加入游戏
    joinGame(table) {
        this.table = table
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

        return table.row
    }

    // 抽牌，补充剩余的牌
    drawCards() {
        let leftNum = this.maxCardNum - this.currentCards.length
        let cards = this.cardFactory.drawCards(leftNum)
        this.currentCards.concat(cards)
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
        if (this.checkPosAvailable(pos)) {
            if (this.mp >= card.cost) {
                this.table.putCard(card, pos)
                this.mp -= card.cost

                let index = this.currentCards.indexOf(card)
                this.currentCards.splice(index, 1)

            } else {
                errorMsg = 'Player: 蓝量不足'
            }
        } else {
            errorMsg = 'Player: 当前位置无法放置'
        }

        if (errorMsg) {
            console.log(errorMsg)
        }
    }
}

export default Player
