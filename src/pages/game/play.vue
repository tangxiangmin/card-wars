<template>
    <div class="stage">
        <!--<chat></chat>-->
        <div class="stage_top">
            <div class="stage_info" v-if="rival">
                敌方生命值：{{rival.hp}}
                敌方魔力值：{{rival.mp}}
            </div>

        </div>
        <div class="stage_map">
            <div v-for="(line, row) in table.rows" :key="row">
                <div :class="{square: true, 'square-disable': item.isDisable, 'square-rival' : item.currentCard && item.currentCard.dir > 0}"
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
                     v-for="(card, index) in player.currentCards" :key="index">
                    {{card.name}} <br>
                    血量：{{card.hp}} <br>
                    消耗：{{card.cost}} <br>
                    步数：{{card.firstStep}}
                </div>
            </div>
            <div class="stage_info">
                <p>当前生命值：{{player.hp}}</p>
                <p>当前魔力值：{{player.mp}}</p>
            </div>
        </div>

        <div :class="{'next-round-disable': table.currentPlayer !== player}" class="next-round" @click="nextRound">
            结束回合
        </div>
        <!--<div class="float-btn" @click="close"></div>-->
    </div>
</template>

<script>
    // 实例化测试数据
    import Player from '../../core/player'
    import Table from '../../core/table'
    import Card from '../../core/card'

    import cardsFactory from '../../core/cards'
    import socket from '../../api/socket'

    import chat from '../../components/chat'


    let table = new Table()

    // 第一回合开始
    window.table = table

    // end 初始化游戏双方 //
    export default {
        name: "stage",
        data() {
            return {
                table: null,
                activeCardIndex: -1,
                uid: null,
            }
        },
        props: {
            users: Array,
        },
        components: {
            chat
        },
        computed: {
            player() {
                let target = table.players.filter(player => {
                    return player.uid === this.uid
                })
                return target && target[0]
            },
            rival() {
                let target = table.players.filter(player => {
                    return player.uid !== this.uid
                })
                return target && target[0]
            }
        },
        created() {
            this.table = table
            console.log(this.users)

            // this.listen()
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
            init() {
                let players = this.users

                players.forEach((userInfo, index) => {
                    let {cards, userName, hp, uid} = userInfo
                    if (userName && Array.isArray(cards)) {
                        let cardGroup = cards

                        // 第一轮的魔力值
                        let startMp = index === 0 ? 3 : 4

                        let player = table.getPlayerByUid(uid)
                        if (!player) {
                            player = new Player({uid, hp, startMp, cardGroup, userName})
                        }

                        table.addPlayer(player)
                    } else {
                        this.toast('账号不存在')
                    }
                })

                // 第一个用户先出手
                let firstPlayer = table.getPlayerByUid(players[0].uid)
                table.newRound(firstPlayer, this.player)
            },
            listen() {
                // 进入房间
                socket.onEnterRoom((players) => {
                    players.forEach((userInfo, index) => {
                        let {cards, userName, hp, uid} = userInfo
                        if (userName && Array.isArray(cards)) {
                            let cardGroup = cards

                            // 第一轮的魔力值
                            let startMp = index === 0 ? 3 : 4

                            let player = table.getPlayerByUid(uid)
                            if (!player) {
                                player = new Player({uid, hp, startMp, cardGroup, userName})
                            }

                            table.addPlayer(player)
                        } else {
                            this.toast('账号不存在')
                        }
                    })

                    // 已经达到两人，开始游戏
                    if (table.players.length === 2) {
                        let firstPlayer = table.getPlayerByUid(players[0].uid)
                        table.newRound(firstPlayer, this.player)
                    }
                })

                socket.onUserLeaveRoom((data) => {
                    let {user} = data
                    table.removePlayer(user)
                    this.toast(`${user.userName}离开房间`)
                })

                // 对手放置卡片
                socket.onPutCard((data) => {
                    let {card, pos} = data
                    pos[0] = this.table.row - pos[0] - 1

                    let rivalCard = new Card(card)
                    rivalCard.setDir(1)
                    rivalCard.setPlayer(this.rival)

                    this.table.putCard(rivalCard, pos)
                })
                // 对手点击结束回合
                socket.onNextRound(() => {
                    this.player.resetNewRound()
                    table.newRound(this.player, this.player)
                })
            },
            toast(tip) {
                this.$layer.open({
                    content: tip
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            },
            // 选择一张卡片
            chooseCard(index) {
                this.activeCardIndex = index
            },
            // 点击区块，执行相关逻辑
            clickSquare(row, col) {
                let player = this.player
                let pos = [row, col]

                let activeCardIndex = this.activeCardIndex
                if (activeCardIndex > -1) {
                    let card = player.currentCards[activeCardIndex]

                    let errorMsg = this.player.putCardToTable(card, pos)

                    if (errorMsg) {
                        this.toast(errorMsg)
                    } else {
                        let cardConfig = cardsFactory.getCardConfigById(card.id)
                        let data = {
                            card: cardConfig,
                            pos: [row, col]
                        }

                        socket.putCard(data)
                        this.activeCardIndex = -1
                    }
                }
            },
            nextRound() {
                socket.nextRound()
                table.newRound(this.rival, this.player)
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
