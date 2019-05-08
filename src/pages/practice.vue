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
        <div class="stage_map">
            <div v-for="(line, row) in rows" :key="row">
                <div :class="{square: true, 'square-disable': row < tableState.player.farthest, 'square-rival' : item.currentCard && item.currentCard.player !== tableState.player.uid}"
                     @click="clickSquare(row, col)"
                     v-for="(item, col) in line" :key="col">

                    <div class="square_inner" :style="item.currentCard && item.currentCard.cursorStyle">
                        {{ item | squareRender}}
                    </div>

                </div>
            </div>
        </div>
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

    import {getUserInfo} from '../api'

    export default {
        name: "practice",
        data() {
            return {
                userInfo: null,
                uid: '',

                // todo remove
                activeCardIndex: -1,
                table: null,

                movedMap: {}, //已移动的表格位置
            }
        },
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
            }
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
                table.initPlayer(players)
                table.startGame()

                this.table = table
            },

            nextRound() {
                console.log('对手回合')
                this.table.newRound(this.rival)

                setTimeout(() => {
                    console.log('选手回合')
                    this.table.newRound(this.player)
                }, 200)
            },
            chooseCard(index) {
                this.activeCardIndex = index
            },
            clickSquare(row, col) {
                console.log(this.player)

                let card = this.player.currentCards[this.activeCardIndex]

                this.player.putCardToTable(card, [row, col])
            }
        }
    }
</script>

<style scoped lang="scss">
    .stage {
        width: 80vw;
        margin: 0 auto;

        height: 100vh;
        display: flex;
        flex-direction: column;
        &_top {
            flex: 1;
            background-color: #ccc;
        }
        &_bottom {
            flex: 1;
            background-color: blue;
        }
        &_map {
            height: 80vw;
            position: relative;
            /*background-image: linear-gradient(#f5f5f5 1px, transparent 0), linear-gradient(90deg, #f5f5f5 1px, transparent 0);*/
            /*background-size: 20vw 20vw, 20vw 20vw;*/
        }
        &_info {
            padding-top: rem(20);
            font-size: rem(30);
            color: #fff;
        }
    }

    .card-list {
        display: flex;
        height: rem(200);
    }

    .card {
        width: rem(200);
        height: 100%;
        font-size: rem(24);
        background-color: #999999;
        border: 1px solid #000;

        &:not(:first-child) {
            transform: translateX(-20%);
        }

        &-on {
            background-color: #fe6e6e;
        }

        &-disable {
            background-color: #444;
        }

    }

    .square {
        width: 20vw;
        height: 16vw;
        float: left;

        border-bottom: $baseborder;
        border-left: $baseborder;
        &:nth-of-type(4n+4) {
            border-right: $baseborder;
        }
        &-disable {
            background-color: #f8f8f8;
        }
        &-rival {
            color: red;
        }
        &_inner {

            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;
            font-size: rem(24);
        }
        &-cursor {
            position: absolute;
            left: 0;
            top: 0;
            background: red;
        }
    }

    .next-round {
        position: fixed;
        right: 0;
        bottom: 10vw;
        width: rem(200);
        height: rem(60);
        line-height: rem(60);
        background-color: coral;
        font-size: rem(24);
        text-align: center;
        color: #fff;
        &-disable {
            background-color: #ccc;
        }
    }

    .float-btn {
        width: rem(100);
        height: rem(100);
        background-color: red;
        position: fixed;
        right: 0;
        top: 0;
        border-radius: 50%;
    }
</style>
