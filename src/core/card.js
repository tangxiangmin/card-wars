/**
 * 2019/1/17 上午8:50
 */

class Card {
    constructor({name, hp, cost, pos, firstStep, player}) {

        this.name = name
        this.hp = hp
        this.cost = cost

        this.pos = pos || null
        this.firstStep = firstStep

        this.table = null
        this.player = player
    }

    move(step = 1) {

    }

    // 放置到桌面上时触发
    onPut(table) {
        this.table = table
        while (this.firstStep--) {

        }
    }

    // 死亡时触发
    onDied() {
    }

    // 每一轮触发
    onNewRound() {

    }

}

export default Card
