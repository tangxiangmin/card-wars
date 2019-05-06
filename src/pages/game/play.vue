<template>
    <div class="stage">
        <!--<prospect></prospect>-->
        <!--对手状态-->
        <div class="stage_top">
            <div class="stage_info" v-if="rival">
                {{rival.username}}
                敌方生命值：{{rival.hp}}
                敌方魔力值：{{rival.mp}}
            </div>

        </div>
        <!--牌桌-->
        <div class="stage_map">
            <div v-for="(line, row) in rows" :key="row">
                <div :class="{square: true, 'square-disable': row < player.farthest, 'square-rival' : item.currentCard && item.currentCard.player !== player.uid}"
                     @click="clickSquare(row, col)"
                     v-for="(item, col) in line" :key="col">

                    <div class="square_inner" :style="item.currentCard && item.currentCard.cursorStyle">
                        {{ item | squareRender}}
                    </div>

                </div>
            </div>
            <!--<div class="square square-cursor" :style="cursorStyle"></div>-->
        </div>
        <!--玩家状态及手中卡牌-->
        <div class="stage_bottom" v-if="player">
            <div class="card-list">
                <div :class="{card: true, 'card-on':index===activeCardIndex, 'card-disable': player && card.cost > player.mp}"
                     @click="chooseCard(index)"
                     v-for="(card, index) in player.currentCards" :key="card.uniqueId">
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
    </div>
</template>

<script>
    import socket from '../../api/socket'
    import prospect from '../../components/prospect'

    export default {
        name: "stage",
        data() {
            return {
                activeCardIndex: -1,
                uid: null,
                table: this.initTable,

                movedMap: {}, //已移动的表格位置
            }
        },
        components: {
            prospect
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
            },
            rows() {
                return this.table.rows
            }
        },

        watch: {
            player: {
                handler(newValue, oldValue) {
                    if (newValue.hp <= 0) {
                        this.showResult('你输了，请再接再厉~')
                    }
                },
                deep: true
            },
            rival: {
                handler(newValue, oldValue) {
                    if (newValue.hp <= 0) {
                        this.showResult('恭喜你，获得胜利~')
                    }
                }
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
            this.listen()
        },
        destroyed() {
            socket.close()
        },
        methods: {
            // 获取当前回合玩家的π
            getCurrentPlayerCard() {
                let cards = []
                let table = this.table
                let targetUid = table.currentRound ? this.player.uid : this.rival.uid

                this.table.rows.forEach((line, row) => {
                    line.forEach((cell, col) => {
                        if (cell.currentCard && cell.currentCard.player === targetUid) {
                            cards.push(cell.currentCard)
                        }
                    })
                })
                return cards
            },
            async moveCard() {
                let cards = this.getCurrentPlayerCard()

                const sleep = (ms) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve()
                        }, ms)
                    })
                }

                let movedMap = this.movedMap
                for (let card of cards) {
                    if (movedMap[card.uniqueId]) {
                        continue
                    }

                    let paths = card.lastRoundPath

                    if (!paths || !paths.length) {
                        continue
                    }

                    let lastPos = paths[paths.length - 1].pos

                    for (let i = 0; i < paths.length; ++i) {
                        let {pos} = paths[i]
                        let [y, x] = pos
                        let diff = this.player.isOwner ? (y - lastPos[0]) : (lastPos[0] - y)
                        let style = {
                            transform: `translate(${0}%, ${diff * 100}%)`,
                        }
                        if (i > 0) {
                            style.transition = 'all linear .3s'
                        }

                        card.cursorStyle = style

                        this.$forceUpdate()

                        await sleep(300)
                    }
                    movedMap[card.uniqueId] = true
                }
            },
            listen() {
                // 进入房间
                socket.onUserLeaveRoom((data) => {
                    socket.close()
                    this.showResult('对手离开房间，你获得胜利~')
                })

                socket.onRoomUpdate((data) => {
                    console.log(data)
                    this.table = data

                    this.moveCard()
                })

                // 对手点击结束回合
                // socket.onNextRound(() => {
                //     // this.player.resetNewRound()
                //     // table.newRound(this.player, this.player)
                // })
            },
            // 选择一张卡片
            chooseCard(index) {
                if (!this.table.currentRound) {
                    this.$toast('不是你的回合')
                    return
                }
                this.activeCardIndex = index
            },
            // 点击区块，执行相关逻辑
            clickSquare(row, col) {
                if (!this.table.currentRound) {
                    this.$toast('不是你的回合')
                    return
                }

                let player = this.player
                let pos = [row, col]

                let activeCardIndex = this.activeCardIndex
                if (activeCardIndex > -1) {
                    let card = player.currentCards[activeCardIndex]

                    socket.putCard({card, pos}, (err) => {
                        this.activeCardIndex = -1
                        if (err) {
                            this.$toast(err)
                        }
                    })
                }
            },
            nextRound() {
                this.movedMap = {}
                socket.nextRound()
            },
            showResult(msg) {
                this.$layer.open({
                    content: msg
                    , btn: ['返回首页']
                    , yes: (index) => {
                        this.$router.back()
                        layer.close(index);
                    }
                });

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
