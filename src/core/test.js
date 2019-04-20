/**
 * 2019/1/23 下午2:14
 */

import Player from './player'
import Table from './table'

import Card from './card'


let card1 = new Card({
    name: '先驱者',
    hp: 1,
    cost: 1,
    pos: null,
    isSelf: true,
    firstStep: 2,
})
let card2 = new Card({
    name: '德鲁伊',
    hp: 5,
    cost: 3,
    pos: null,
    isSelf: true,
    firstStep: 1,
})

let playerA = new Player([
    card1,
    card1,
    card2
])

let playerB = new Player([
    card1,
    card2,
    card2
])

let table = new Table()

playerA.joinGame(table)
playerB.joinGame(table)

playerA.putCardToTable(card1, [1, 0])
