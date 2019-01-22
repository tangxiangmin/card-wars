/**
 * 2019/1/17 上午8:46
 */

class Square {
    constructor({coord, currentCard, isDisabled}) {
        this.coord = coord // 坐标
        this.currentCard = currentCard // 当前位置上的卡片
        this.isDisabled = isDisabled // 是否可以访问

    }

    clearCurrentCard() {
        this.currentCard = null
    }

    // 检测卡牌碰撞
    checkCollapse(card) {
        let currentCard = this.currentCard
        let isAlive = false
        if (currentCard === card) {
            // 当前位置包含有方卡牌
            if (currentCard.isSelf === card.isSelf) {
                return isAlive
            } else {
                // 两张卡牌生命值抵消
                currentCard.hp -= card.hp
                card.hp -= currentCard.hp

                if (currentCard.hp > 0) {
                    this.currentCard = currentCard
                } else if (card.hp > 0) {
                    this.currentCard = card
                    isAlive = true
                } else {
                    this.clearCurrentCard()
                }
            }
        } else {
            isAlive = true
            this.currentCard = card
        }
        return isAlive
    }


}

class StageMap {
    constructor(row, col) {
        this.row = row
        this.col = col

        this.maxStep = 1 // 默认初始可移动
        this.rows = []
        this.renderRows()
    }

    // 获取所有卡牌类型
    getAllCards() {
        let selfCards = []
        let enemyCards = []
        this.rows.forEach(line => {
            line.forEach(item => {
                let {currentCard} = item
                if (currentCard) {
                    if (currentCard.isSelf) {
                        selfCards.push(currentCard)
                    } else {
                        enemyCards.push(currentCard)
                    }
                }
            })
        })

        return {
            selfCards,
            enemyCards
        }
    }

    // 根据每个方块上的部队状态，计算可部署区域
    getMaxStep() {
        let minRowIndex = this.row - 1

        this.rows.forEach(line => {
            line.forEach(item => {
                let [row] = item.coord
                if (row < minRowIndex) {
                    minRowIndex = row
                }
            })
        })

        return this.row - minRowIndex
    }

    renderRows() {
        let {row, col, maxStep} = this
        let rows = []

        for (let i = 0; i < row; i++) {
            rows[i] = []
            for (let j = 0; j < col; j++) {

                let square = new Square({
                    coord: [i, j],
                    currentCard: null,
                    isDisabled: row - i > maxStep
                })

                rows[i].push(square)

            }
        }

        this.rows = rows
    }

    putCard(card, [row, col]) {
        let rows = this.rows
        let square = rows[row][col]

        if (square.isDisabled) {
            alert("当前位置未探索，无法放置")
            return
        }

        let currentCard = square.currentCard
        // 只能放置在空的元素上
        if (!currentCard) {
            card.pos = [row, col]

            square.currentCard = card

            for (let i = 1; i <= card.firstStep; ++i) {
                setTimeout(() => {
                    this.moveCard(card)
                }, 500 * i)
            }

            return true
        }
        return false
    }

    // 每轮游戏结束，自动更新地图
    moveCard(card, step = 1) {
        let rows = this.rows

        let [row, col] = card.pos

        rows[row][col].clearCurrentCard()

        if (card.isSelf) {
            if (row <= 0) {
                console.log(`消除敌方血量${card.hp}`)
                card = null
                return
            }
            row -= step // 友军向上移动

        } else {
            if (row >= this.row - 1) {
                console.log(`消除我方血量${card.hp}`)
                card = null
            }
            row += step // 敌军向下移动
        }

        let nextSquare = rows[row][col]
        card.pos = [row, col]

        let isAlive = nextSquare.checkCollapse(card)
        // 如果存活了，则当前行可放置
        if (isAlive && nextSquare.isDisabled) {
            rows[row].forEach(square => {
                square.isDisabled = false
            })
        }
    }

    update() {
        // 从前到后更新每张卡片的位置
        let {selfCards, enemyCards} = this.getAllCards()

        // 当前回合结束
        enemyCards.forEach(card => {
            this.moveCard(card)
        })

        selfCards.forEach(card => {
            this.moveCard(card)
        })
    }
}

export default StageMap
