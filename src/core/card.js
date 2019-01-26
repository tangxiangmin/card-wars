/**
 * 2019/1/17 上午8:50
 */

class Card {
    constructor({id, name, hp, cost, pos, firstStep,}) {
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

    setPlayer(player) {
        this.player = player
    }

    setDir(dir) {
        this.dir = dir
    }

    // 放置到桌面上时触发
    onPut(table) {
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
