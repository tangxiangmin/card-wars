<!--单机模式，纯客户端游戏，用于开发和测试游戏逻辑-->
<template>
    <div class="stage" v-if="tableState">
        <!--对手状态-->
        <div class="stage_top">
            <div class="stage_info" v-if="tableState && tableState.rival">
                {{tableState.rival.username}}
                敌方生命值：{{tableState.rival.hp}}
                敌方魔力值：{{tableState.rival.mp}}
            </div>

        </div>
        <!--牌桌-->
        <game-table
                v-if="tableState.player"
                :rows="rows"
                :player="this.player"
                :clickSquare="clickSquare"
                :farthest="tableState.player.farthest"></game-table>

        <!--玩家状态及手中卡牌-->
        <div class="stage_bottom" v-if="tableState && tableState.player">
            <div class="card-list">
                <div :class="{card: true, 'card-on':index===activeCardIndex, 'card-disable': tableState.player && card.cost > tableState.player.mp}"
                     @click="chooseCard(index)"
                     v-for="(card, index) in tableState.player.currentCards" :key="card.uniqueId">
                    {{card.name}} <br>
                    血量：{{card.hp}} <br>
                    消耗：{{card.cost}} <br>
                    步数：{{card.firstStep}}
                </div>
            </div>
            <div class="stage_info">
                <p>{{tableState.player.username}}</p>
                <p>当前生命值：{{tableState.player.hp}}</p>
                <p>当前魔力值：{{tableState.player.mp}}</p>
            </div>
        </div>

        <div :class="{'next-round-disable': tableState && !tableState.currentRound}" class="next-round"
             @click="nextRound">
            结束回合
        </div>
    </div>
</template>

<script>

    import Table from '../../core/table'

    import gameTable from '../components/game-table'

    import {getUserInfo} from '../api'

    const robotRound = (robot) => {
        let cards = robot.currentCards.filter(card => card.cost < robot.mp)

        // 初级机器人默认选择一张可放置的牌放在桌面[0,0]上
        let cells = robot.getAvailableCells()
        let cell = cells[Math.floor(Math.random() * cells.length - 1)]
        if (cards.length && cell) {
            try {
                let card = cards[0]
                console.log(`对手出牌，card:${card && card.name}, pos: ${cell && cell.pos}`)
                robot.putCardToTable(card, cell.pos)
            } catch (e) {
                console.log(e)
            }
        } else {

            console.log(`对手无法出牌，可用card数量${cards.length}, 随机pos: ${cell && cell.pos}`)
        }

    }
    export default {
        name: "practice",
        data() {
            return {
                userInfo: null,
                uid: '',

                activeCardIndex: -1,
                table: null,
                movedMap: {}, //已移动的表格位置
            }
        },
        components: {gameTable},
        computed: {
            tableState() {
                return this.table ? this.table.getCurrentState(this.uid) : {}
            },
            player() {
                if (this.table) {
                    return this.table.players.filter(player => player.uid === this.uid)[0]
                }
            },
            rival() {
                if (this.table) {
                    return this.table.players.filter(player => player.uid !== this.uid)[0]
                }
            },
            rows() {
                return this.tableState.rows
            },

        },
        filters: {
            squareRender(item) {
                let {currentCard} = item
                if (!currentCard) {
                    return ""
                }

                return `${currentCard.name}(${currentCard.hp})`
            },
        },
        created() {
            getUserInfo().then(res => {
                let userInfo = res.data
                this.uid = userInfo.id

                this.init(userInfo)
            }).catch(e => {
            })
        },
        methods: {
            init(player) {
                let robot = {
                    cards: "1, 2, 3, 4, 5, 6",
                    hp: 9,
                    id: 2,
                    username: "机器人A"
                }

                let players = [player, robot]

                let table = new Table()
                table.setPlatform('client')

                table.initPlayer(players)
                table.startGame()
                this.table = table
            },

            nextRound() {
                console.log('对手回合')
                let robot = this.rival
                this.table.newRound(this.rival)
                // 机器人回合，托管出牌
                robotRound(robot)

                setTimeout(() => {
                    console.log('选手回合')
                    this.table.newRound(this.player)
                }, 5000)
            },
            chooseCard(index) {
                this.activeCardIndex = index
            },
            clickSquare(row, col) {
                // 获取选择的卡片
                let card = this.player.currentCards[this.activeCardIndex]

                // 放入卡片
                try {
                    this.player.putCardToTable(card, [row, col])
                } catch (e) {
                    this.$toast(e)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
