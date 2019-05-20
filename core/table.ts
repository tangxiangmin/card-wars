/**
 * 2019/1/21 下午6:15
 * 牌桌
 */
import Player from "./player";
import Card from "./card";
import EventEmitter from './eventEmitter'

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

    constructor(pos: number[], currentCard: Card) {
        this.pos = pos
        this.currentCard = currentCard
    }

    clearCurrentCard() {
        let card = this.currentCard
        if (card) {
            let table = card.player.table
            table.emit('cardLeave', {pos: this.pos, card})
        }

        this.currentCard = null
    }

    isEmpty() {
        return this.currentCard === null
    }

    collapse(card: Card) {
        let currentCard = this.currentCard
        let isAlive = false
        if (currentCard) {
            // 当前位置包含友方卡牌
            if (currentCard.player === card.player) {
                console.log(card, currentCard)
                return false
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

        let table = card.player.table
        table.emit('cardEnter', {pos: this.pos, card})

        // 保存卡牌本轮的移动路径
        card.lastRoundPath.push({
            pos: card.pos
        })
    }

    toJSON() {
        let card = this.currentCard

        if (card) {
            return {
                pos: this.pos,
                currentCard: {
                    player: card.player.uid,
                    name: card.name,
                    hp: card.hp,
                    firstStep: card.firstStep,
                    uniqueId: card.uniqueId,
                    lastRoundPath: card.lastRoundPath,
                }
            }
        } else {
            return {
                pos: this.pos,
                currentCard: null
            }
        }

    }
}

const NEED_PLAYER_NUM = 2

// 游戏表格
class Table extends EventEmitter {
    row: number
    col: number
    rows: TableCell[][]
    basicRows: any[][]

    players: Player[]
    currentPlayer: Player
    platform: string
    isClient: boolean

    constructor(row = 5, col = 4) {
        super()
        this.row = row
        this.col = col

        this.players = []
        this.currentPlayer = null
        this.isClient = false

        this._initRows()
    }

    setPlatform(platform) {
        if (platform === 'client') {
            this.isClient = true
        }
        this.platform = platform
    }

    _initRows() {
        let {row, col} = this
        let rows = []
        let basicRows = []
        for (let i = 0; i < row; i++) {
            rows[i] = []
            basicRows[i] = []
            for (let j = 0; j < col; j++) {
                let square = new TableCell([i, j], null)
                basicRows[i].push({})
                rows[i].push(square)
            }
        }

        this.rows = rows

        this.basicRows = basicRows
    }

    // 增加选手
    _addPlayer(player: Player) {
        if (this.players.length > NEED_PLAYER_NUM) {
            throw new Error(`最多${NEED_PLAYER_NUM}名选手`)
        }
        let uid = player.uid
        let user = this.getPlayerByUid(uid)
        if (!user) {
            this.players.push(player)

            player.table = this
            player.isOwner = this.isOwner(player)

        } else {
            player = user
            // console.log(`${player.userName}用户已加入该对局`)
        }
        return player
    }

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
        let rival = this.getPlayerRival(firstPlayer)
        rival.drawCards()

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

    getPlayerRival(player: Player = this.currentPlayer) {
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

    // 判断玩家是否为房主：正视角观战
    isOwner(player: Player) {
        return player === this.players[0]
    }

    // 向棋盘上对应位置放置卡片
    putCard(card: Card, pos: number[]) {
        let cell = this.getCellByPos(pos)
        cell.putCard(card)
        card.onPut(this)

        // 放置后自动移动
        let firstStep = card.firstStep

        let index = 0
        while (firstStep) {
            index++
            firstStep--
            if (this.isClient) {
                // 延时展示卡牌运动路径
                setTimeout(() => {
                    this.moveCard(card)
                }, index * 500)
            } else {
                this.moveCard(card)
            }
        }
    }

    // 移动卡片一步
    moveCard(card: Card) {
        if (card.isDie) {
            return
        }

        let step = card.dir

        let originCell = this.getCellByPos(card.pos)

        let [row, col] = card.pos
        let nextPos = [row + step, col]

        let isEnd = (card.dir < 0 && row + step < 0) || (card.dir > 0 && row + step >= this.row)

        if (isEnd) {
            // 抵达敌方阵营
            let rivalPlayer = this.getPlayerRival()
            rivalPlayer.underAttack(card)
            originCell.clearCurrentCard()
            card.isDie = true
        } else {
            let nextCell = this.getCellByPos(nextPos)
            let canMove = nextCell.collapse(card)
            if (canMove) {
                originCell.clearCurrentCard()
                nextCell.putCard(card)
            }
        }
    }

    // 新回合
    newRound(player: Player) {
        // 设置当前回合的选手
        this.currentPlayer = player

        // 每一轮开始时，当前玩家存活的card应该继续执行
        let cards = this.getPlayerCards(player)
        cards.forEach(card => {
            card.lastRoundPath = []
            this.moveCard(card)
        })

        player.resetNewRound()

    }

    // 获取当前场景状态
    getCurrentState(uid: number) {
        let rows: object[][] = []
        let currentRound = this.currentPlayer.uid === uid
        let isOwner = this.players[0].uid === uid

        // 每位玩家的视角都在下方，上方为对手的阵营，因此需要调整rows的数据
        for (let i = 0; i < this.row; ++i) {
            rows[i] = []
        }
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; ++j) {
                let cell = this.rows[i][j]

                if (isOwner) {
                    rows[i][j] = cell.toJSON()
                } else {
                    rows[this.row - 1 - i][j] = cell.toJSON()
                }
            }
        }

        let player = this.getPlayerByUid(uid)

        let rival = this.getPlayerRival(player).toJSON()
        // 无法看见对手的牌组
        delete rival.currentCards

        return {
            player: player.toJSON(),
            rival: rival,
            rows,
            currentRound
        }
    }
}

export default Table
