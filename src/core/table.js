/**
 * 2019/1/21 下午6:15
 * 牌桌
 */

class TableCell {
    constructor({coord, currentCard}) {
        this.coord = coord
        this.currentCard = currentCard
    }

    clearCurrentCard() {
        this.currentCard = null
    }

    isEmpty() {
        return this.currentCard === null
    }

    putCard(card) {
        let currentCard = this.currentCard
        let isAlive = false
        if (currentCard === card) {
            // 当前位置包含有方卡牌
            if (currentCard.player === card.player) {
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

class Table {
    constructor(row = 4, col = 4) {
        this.row = row
        this.col = col

        this.initRows()
    }

    initRows() {
        let {row, col} = this
        let rows = []

        for (let i = 0; i < row; i++) {
            rows[i] = []
            for (let j = 0; j < col; j++) {
                let square = new TableCell({
                    coord: [i, j],
                    currentCard: null,
                })

                rows[i].push(square)
            }
        }

        this.rows = rows
    }

    walkCells(cb) {
        let {row, col} = this
        let rows = this.rows
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let cell = rows[i][j]
                cb(cell)
            }
        }
    }

    getPlayerCards(player) {
        let cards = []
        this.walkCells((cell) => {
            if (player === cell.player) {
                cards.push(cards)
            }
        })
        return cards
    }

    getCellByPos(pos) {
        let [x, y] = pos
        return this.rows[x][y]
    }

    putCard(card, pos) {
        let cell = this.getCellByPos(pos)
        cell.putCard(card)

        card.onPut(this)
    }
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
}

export default Table
