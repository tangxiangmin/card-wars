/**
 * 2019/1/21 下午6:15
 * 牌桌
 */
import Player from "./player";
import Card from "./card";

// 数据库保存的原始用户信息
export interface userInfo {
    id: number,
    username: string,
    hp: number,
    cards: string
}

// 每个格子实例
export class TableCell {
    pos: number[]
    currentCard: Card
    isDisable: boolean

    constructor(pos: number[], currentCard: Card) {
        this.pos = pos
        this.currentCard = currentCard
        this.isDisable = false
    }

    clearCurrentCard() {
        this.currentCard = null
    }

    setDisable(isDisable: boolean) {
        this.isDisable = isDisable
    }

    isEmpty() {
        return this.currentCard === null
    }

    collapse(card: Card) {
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

    putCard(card: Card) {
        this.currentCard = card
        card.pos = this.pos
    }
}

const NEED_PLAYER_NUM = 2

// 游戏表格
class Table {
    row: number
    col: number
    rows: TableCell[][]

    players: Player[]
    currentPlayer: Player

    constructor(row = 4, col = 4) {
        this.row = row
        this.col = col

        this.players = []
        this.currentPlayer = null

        this._initRows()
    }

    _initRows() {
        let {row, col} = this
        let rows = []

        for (let i = 0; i < row; i++) {
            rows[i] = []
            for (let j = 0; j < col; j++) {
                let square = new TableCell([i, j], null)

                rows[i].push(square)
            }
        }

        this.rows = rows
    }

    // 增加选手
    _addPlayer(player: Player) {
        if (this.players.length > NEED_PLAYER_NUM) {
            throw new Error(`最多${NEED_PLAYER_NUM}名选手`)
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

    // 移除选手
    // 一局游戏结束，则当前table会销毁，因此不需要调用_removePlayer的场景
    // _removePlayer(player: Player) {
    //     let players = this.players
    //
    //     for (let i = 0; i < players.length; ++i) {
    //         if (players[i].uid === player.uid) {
    //             players.splice(i, 1)
    //             break
    //         }
    //     }
    // }

    // 遍历表格
    _walkCells(cb: Function) {
        let {row, col} = this
        let rows = this.rows
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let cell: TableCell = rows[i][j]
                cb(cell)
            }
        }
    }

    // ========外部api========//
    // 初始化玩家，应该等待双方玩家都加入后调用
    initPlayer(users: Array<userInfo>) {
        if (users.length !== NEED_PLAYER_NUM) {
            throw new Error(`users长度不正确，应为${NEED_PLAYER_NUM}`)
        }

        users.forEach((user: userInfo, index: number) => {
            // 第一轮的魔力值
            let startMp = index === 0 ? 3 : 4

            // 加入选手
            let player = this.getPlayerByUid(user.id)
            if (!player) {
                player = new Player(user, startMp)
                this._addPlayer(player)
            }
        })
    }

    // 开始游戏
    startGame() {
        if (this.players.length < NEED_PLAYER_NUM) {
            throw new Error(`房间人数小于${NEED_PLAYER_NUM}人，无法开始游戏`)
        }

        // 第一个用户先出手
        let firstPlayer = this.players[0]
        this.newRound(firstPlayer)
    }

    // 根据uid获取玩家
    getPlayerByUid(uid: number) {
        return this.players.filter(item => {
            return item.uid === uid
        })[0]
    }

    // 获取牌桌上某个玩家的所有卡牌
    getPlayerCards(player: Player) {
        let cards: Card[] = []

        this._walkCells((cell: TableCell) => {
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

    getCellByPos(pos: number[]): TableCell {
        if (!pos) {
            throw 'getCellByPos 无效 pos参数'
        }

        let [x, y] = pos
        return this.rows[x][y]
    }

    // 向棋盘上对应位置放置卡片
    putCard(card: Card, pos: number[]) {
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
    moveCard(card: Card) {
        if (card.isDie) {
            return
        }

        let step = card.dir

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

        this.updateCellDisable(this.currentPlayer)
    }

    // 更新单元格的状态
    updateCellDisable(player: Player) {
        let farStep = player.getFarthestBound()

        // 更新
        this._walkCells((cell: TableCell) => {
            let [row] = cell.pos
            cell.setDisable(row < farStep)
        })
    }


    // 新回合
    newRound(player: Player) {
        // 设置当前回合的选手
        this.currentPlayer = player

        // 每一轮开始时，当前玩家存活的card应该继续执行
        let cards = this.getPlayerCards(player)

        cards.forEach(card => {
            this.moveCard(card)
        })

        // 移动完毕后，更新当前玩家的可移动区域
        this.updateCellDisable(player)
    }

    // 获取当前场景状态
    getCurrentState() {
        // todo 返回当前游戏场景的状态，改状态用于渲染数据
    }
}

export default Table
