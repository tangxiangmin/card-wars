<template>
    <div class="stage">
        <!--<chat></chat>-->

        <div class="stage_top">
            <div class="stage_info" v-if="rival">
                {{rival.username}}
                敌方生命值：{{rival.hp}}
                敌方魔力值：{{rival.mp}}
            </div>

        </div>
        <div class="stage_map">
            <div v-for="(line, row) in table.rows" :key="row">
                <div :class="{square: true, 'square-disable': row < player.farthest, 'square-rival' : item.currentCard && item.currentCard.player === player.uid}"
                     @click="clickSquare(row, col)"
                     v-for="(item, col) in line" :key="col">
                    {{ item | squareRender}}
                </div>
            </div>
        </div>
        <div class="stage_bottom" v-if="player">
            <div class="card-list">
                <div :class="{card: true, 'card-on':index===activeCardIndex, 'card-disable': player && card.cost > player.mp}"
                     @click="chooseCard(index)"
                     v-for="(card, index) in player.currentCards" :key="card.id">
                    {{card.name}} <br>
                    血量：{{card.hp}} <br>
                    消耗：{{card.cost}} <br>
                    步数：{{card.firstStep}}
                </div>
            </div>
            <div class="stage_info">
                <p>{{player.username}}</p>
                <p>当前生命值：{{player.hp}}</p>
                <p>当前魔力值：{{player.mp}}</p>
            </div>
        </div>

        <div :class="{'next-round-disable': !table.currentRound}" class="next-round" @click="nextRound">
            结束回合
        </div>

        <!--<div class="float-btn" @click="close"></div>-->
    </div>
</template>

<script>
    // 实例化测试数据
    // import Player from '../../core/player'
    // import Card from '../../core/card'

    import socket from '../../api/socket'

    // end 初始化游戏双方 //
    export default {
        name: "stage",
        data() {
            return {
                activeCardIndex: -1,
                uid: null,
                table: this.initTable
            }
        },
        props: {
            initTable: Object,
        },

        computed: {
            player() {
                return this.table.player
            },
            rival() {
                return this.table.rival
            }
        },
        created() {
            this.listen()
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
        methods: {
            listen() {
                // 进入房间
                socket.onUserLeaveRoom((data) => {
                    let {user} = data
                    console.log(user, '离开房间')
                })

                socket.onRoomUpdate((data) => {
                    console.log(data)
                    this.table = data
                })

                // 对手点击结束回合
                // socket.onNextRound(() => {
                //     // this.player.resetNewRound()
                //     // table.newRound(this.player, this.player)
                // })
            },
            // 选择一张卡片
            chooseCard(index) {
                this.activeCardIndex = index
            },
            // 点击区块，执行相关逻辑
            clickSquare(row, col) {
                let player = this.player
                let pos = [row, col]

                // todo 前端做一下简单校验
                let activeCardIndex = this.activeCardIndex
                if (activeCardIndex > -1) {
                    let card = player.currentCards[activeCardIndex]

                    socket.putCard({card, pos}, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            },
            nextRound() {
                socket.nextRound()
            },
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
        height: 20vw;
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: rem(24);

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
