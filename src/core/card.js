/**
 * 2019/1/17 上午8:50
 */

class Card {
    constructor({name, hp, cost, pos, firstStep}) {

        this.name = name
        this.hp = hp
        this.cost = cost

        this.pos = pos || null
        this.firstStep = firstStep

        this.table = null
        this.player = null
    }

    setPlayer(player) {
        this.player = player
    }


    // 放置到桌面上时触发
    onPut(table) {
        this.table = table
        // 做一些其他处理
    }

    // 死亡时触发
    onDied() {
    }

    // 每一轮触发
    onNewRound() {

    }

}

export default Card
