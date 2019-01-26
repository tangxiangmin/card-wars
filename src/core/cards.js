/**
 * 2019/1/26 下午9:54
 */

import Card from './card'

export default {
    createCardById(cardId) {
        let config = this.getCardConfigById(cardId)
        return new Card(config)
    },
    getCardConfigById(cardId) {
        let map = {
            1: {
                id: 1,
                name: '先驱者',
                hp: 1,
                cost: 1,
                pos: null,
                firstStep: 2,
            },
            2: {
                id: 2,
                name: '德鲁伊',
                hp: 5,
                cost: 3,
                pos: null,
                firstStep: 1,
            }
        }

        if (map[cardId]) {
            return map[cardId]
        } else {
            throw `id为：${cardId}找不到对应的卡牌`
        }
    }
}
