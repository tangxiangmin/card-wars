<template>
    <div class="stage">
        <div class="stage_top"></div>
        <div class="stage_map">
            <div v-for="(line, row) in table.rows" :key="row">
                <div :class="{square: true, 'square-disable': item.isDisabled}" @click="clickSquare(row, col)"
                     v-for="(item, col) in line" :key="col">
                    {{ item | squareRender}}
                </div>
            </div>
        </div>
        <div class="stage_bottom">
            <div class="card-list">
                <div :class="{card: true, 'card-on':index===activeCardIndex}" @click="chooseCard(index)"
                     v-for="(card, index) in player.currentCards" :key="index">{{card.name}}
                </div>
            </div>
            <div class="stage_info">
                <p>当前生命值：{{player.hp}}</p>
                <p>当前魔力值：{{player.mp}}</p>
            </div>

        </div>

        <div class="next-round" @click="nextRound">敌方回合</div>
    </div>
</template>

<script>
    // 实例化测试数据
    import Player from './core/player'
    import Table from './core/table'
    import Card from './core/card'


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

    let playerA = new Player({
        cardGroup: [
            card1,
            card1,
            card2
        ]
    })

    let playerB = new Player({
        cardGroup: [
            card1,
            card2,
            card2
        ]
    })

    let table = new Table()

    table.addPlayer(playerA)
    table.addPlayer(playerB)

    table.newRound(playerA)

    // end 初始化游戏双方 //

    export default {
        name: "stage",
        data() {
            return {
                table: null,
                activeCardIndex: -1,

                player: playerA,// 玩家自己
                rival: playerB,  // 对手
            }
        },
        computed: {},
        created() {
            this.table = table
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
                        this.activeCardIndex = -1
                    }
                }
            },
            nextRound() {
                // this.table.update()

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
    }

</style>
