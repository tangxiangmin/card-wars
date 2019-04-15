/**
 * 2019/1/21 下午6:15
 * 牌桌
 */

class TableCell {
    constructor({coord, currentCard}) {
        this.coord = coord
        this.currentCard = currentCard
        this.isDisable = false
    }

    clearCurrentCard() {
        this.currentCard = null
    }

    setDisable(isDisable) {
        this.isDisable = isDisable
    }

    isEmpty() {
        return this.currentCard === null
    }

    collapse(card) {
        let currentCard = this.currentCard
        let isAlive = false
        if (currentCard) {
            // 当前位置包含有方卡牌
            if (currentCard.player === card.player) {
                return isAlive
            } else {
                // 两张卡牌生命值抵消
                let hp1 = card.hp
                let hp2 = currentCard.hp
                currentCard.hp -= hp1
                card.hp -= hp2

                if (currentCard.hp > 0) {
                    this.currentCard = currentCard
                } else if (card.hp > 0) {
                    this.currentCard = card
                    isAlive = true
                } else {
                    isAlive = false
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

    getPlayerByUid(uid) {
        return this.players.filter(item => {
            return item.uid === uid
        })[0]
    }

    getPlayerCards(player) {
        let cards = []

        this.walkCells((cell) => {
            let card = cell.currentCard
            if (card && (card.player === player)) {
                cards.push(card)
            }
        })
        return cards
    }

    getPlayerRival() {
        let player = this.currentPlayer
        return this.players.filter(p => {
            return player != p
        })[0]
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
            setTimeout(() => {
                this.moveCard(card)
            }, (firstStep + 1) * 500)
        }
    }

    // 移动卡片一步
    moveCard(card) {
        if (card.isDie) {
            return
        }

        let step = card.dir * 1

        let originCell = this.getCellByPos(card.pos)
        originCell.clearCurrentCard()

        let [row, col] = card.pos
        let nextPos = [row + step, col]

        let isEnd = (card.dir < 0 && row + step < 0) || (card.dir > 0 && row + step >= this.row)

        if (isEnd) {
            let rivalPlayer = this.getPlayerRival()
            rivalPlayer.underAttack(card)
        } else {
            let nextCell = this.getCellByPos(nextPos)
            let isAlive = nextCell.collapse(card)

            if (isAlive) {
                nextCell.putCard(card)
            }
        }

        this.updateCellDisable()
    }

    // 更新单元格的状态
    updateCellDisable() {
        let player = this.currentPlayer
        let farStep = player.getFarthestBound()

        // 更新
        this.walkCells((cell) => {
            let [row] = cell.coord
            cell.setDisable(row < farStep)
        })
    }

    // 增加选手
    addPlayer(player) {
        if (this.players.length > 2) {
            throw "最多2名选手"
        }
        let uid = player.uid
        let user = this.getPlayerByUid(uid)
        if (!user) {
            player.table = this
            this.players.push(player)
        } else {
            player = user
            // console.log(`${player.userName}用户已加入该对局`)
        }
        return player
    }

    // 新回合
    newRound(player) {
        // 设置当前回合的选手
        this.currentPlayer = player
        let cards = this.getPlayerCards(player)

        cards.forEach(card => {
            this.moveCard(card)
        })

        this.updateCellDisable()
    }
}

export default Table
