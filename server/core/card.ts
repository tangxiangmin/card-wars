/**
 * 2019/1/17 上午8:50
 */
import Table from "./table";
import Player from "./player";

class Card {
    id: number
    name: string
    hp: number
    cost: number
    pos: number[]
    firstStep: number
    dir: number // todo enum
    table: Table
    player: Player
    isDie: boolean

    constructor(id: number, name: string, hp: number, cost: number, pos: number[], firstStep: number) {
        this.id = id
        this.name = name
        this.hp = hp
        this.cost = cost

        this.pos = pos || null
        this.firstStep = firstStep

        this.dir = -1

        this.table = null
        this.player = null
        this.isDie = false
    }

    setPlayer(player: Player) {
        this.player = player
    }

    setDir(dir: number) {
        this.dir = dir
    }

    // 放置到桌面上时触发
    onPut(table: Table) {
        this.table = table
        // 做一些其他处理
    }

    // 死亡时触发
    beforeDie() {
    }

    // 死亡后
    afterDie() {
        this.isDie = true
        console.log(`${this.name}死亡了`)

    }

    // 每一轮触发
    onNewRound() {

    }

}

export default Card
