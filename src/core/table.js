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

    collapse(card) {
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

    putCard(card) {
        this.currentCard = card
        card.pos = this.coord
    }
}

class Table {
    constructor(row = 4, col = 4) {
        this.row = row
        this.col = col

        this.initRows()

        this.players = []
        this.currentPlayer = null
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
        if (!pos) {
            throw 'getCellByPos 无效 pos参数'
        }

        let [x, y] = pos
        return this.rows[x][y]
    }

    // 向棋盘上对应位置放置卡片
    putCard(card, pos) {
        let cell = this.getCellByPos(pos)
        cell.putCard(card)
        card.onPut(this)

        // 放置后自动移动
        let firstStep = card.firstStep
        while (firstStep) {
            firstStep--
            this.moveCard(card)
        }
    }

    // 向上移动卡片一步
    moveCard(card) {
        let originCell = this.getCellByPos(card.pos)
        originCell.clearCurrentCard()

        let [row, col] = card.pos
        let nextPos = [row - 1, col]

        let nextCell = this.getCellByPos(nextPos)
        let isAlive = nextCell.collapse(card)

        if (isAlive) {
            nextCell.putCard(card)
        }
    }

    // 增加选手
    addPlayer(player) {
        player.table = this
        this.players.push(player)
    }

    // 新回合
    newRound(player) {
        // 设置当前回合的选手
        this.currentPlayer = player
        let cards = this.getPlayerCards(player)

        cards.forEach(card => {
            this.moveCard(card)
        })

    }
}

export default Table
