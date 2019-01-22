<template>
    <div class="stage">
        <div class="stage_top"></div>
        <div class="stage_map">
            <div v-for="(line, row) in rows" :key="row">
                <div :class="{square: true, 'square-disable': item.isDisabled}" @click="clickSquare(row, col)"
                     v-for="(item, col) in line" :key="col">
                    {{ item | squareRender}}
                </div>
            </div>
        </div>
        <div class="stage_bottom">
            <div class="card-list">
                <div :class="{card: true, 'card-on':index===activeCardIndex}" @click="chooseCard(index)"
                     v-for="(card, index) in cardList" :key="index">{{card.name}}
                </div>
            </div>
            <div class="stage_info">
                <p>当前生命值：{{hp}}</p>
                <p>当前魔力值：{{mp}}</p>
            </div>

        </div>

        <div class="next-round" @click="nextRound">敌方回合</div>
    </div>
</template>

<script>

    import StageMap from './core/map'

    export default {
        name: "stage",
        data() {
            return {
                stageMap: null,
                round: 1, // 游戏回合
                mp: 3, // 玩家魔力值
                hp: 10, // 玩家生命值
                cardList: [{
                    name: '先驱者',
                    hp: 1,
                    cost: 1,
                    pos: null,
                    isSelf: true,
                    firstStep: 2,
                }, {
                    name: '德鲁伊',
                    hp: 5,
                    cost: 3,
                    pos: null,
                    isSelf: true,
                    firstStep: 1,
                }],
                activeCardIndex: -1,
                maxStep: 1
            }
        },
        computed: {
            rows() {
                return this.stageMap.rows || [[]]
            },
            maxMp() {
                return this.round + 2
            }
        },
        created() {
            let col = 4,
                row = 4
            let stageMap = new StageMap(row, col)

            this.mp = this.maxMp


            this.stageMap = stageMap
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
            // 选择一张卡片
            chooseCard(index) {
                this.activeCardIndex = index
            },
            // 点击区块，执行相关逻辑
            clickSquare(row, col) {
                let activeCardIndex = this.activeCardIndex
                if (activeCardIndex > -1) {
                    let card = this.cardList[activeCardIndex]
                    if (this.mp < card.cost) {
                        this.activeCardIndex = -1
                        this.$layer.open({
                            content: '蓝量不足，无法放置'
                            , skin: 'msg'
                            , time: 2 //2秒后自动关闭
                        });
                        return
                    }

                    // 将卡牌放在地图上
                    let isSuccess = this.stageMap.putCard(card, [row, col])
                    if (isSuccess) {
                        this.mp -= card.cost
                        this.cardList.splice(activeCardIndex, 1)
                        this.activeCardIndex = -1
                    }
                }
            },
            nextRound() {
                this.stageMap.update()

                this.round++
                this.mp = this.maxMp
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
