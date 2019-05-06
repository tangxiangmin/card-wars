import Card from "../../core/card";


let createCardTemp = (id: number, name: string, hp: number, cost: number, firstStep: number): object => {
    return {
        id,
        name,
        hp,
        cost,
        firstStep,
        pos: null
    }
}
export default {
    createCardById(cardId: number) {
        let {
            id,
            name,
            hp,
            cost,
            firstStep,
        } = this.getCardConfigById(cardId)
        return new Card(id,
            name,
            hp,
            cost,
            null,
            firstStep,)
    },
    getCardConfigById(cardId: number) {
        let map: any = {
            1: createCardTemp(1, '先驱者', 1, 1, 2),
            2: createCardTemp(2, '德鲁伊', 5, 3, 1),
            3: createCardTemp(3, '新兵', 1, 1, 1),
            4: createCardTemp(4, '老兵', 2, 1, 1),
            5: createCardTemp(5, '龙', 9, 5, 1),
            6: createCardTemp(6, '骑士', 3, 3, 2),
        }

        if (map[cardId]) {
            return map[cardId]
        } else {
            throw `id为：${cardId}找不到对应的卡牌`
        }
    }
}
