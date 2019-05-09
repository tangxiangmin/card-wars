<template>
    <div class="stage_map">
        <div v-for="(line, row) in rows" :key="row">
            <div :class="{square: true, 'square-disable': row < farthest, 'square-rival' : item && item.isRival}"
                 @click="clickSquare(row, col)"
                 v-for="(item, col) in line" :key="col">

                <div class="square_inner" :style="item && item.currentCard && item.currentCard.cursorStyle">
                    {{ item | squareRender}}
                </div>

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "game-table",
        props: {
            rows: Array,
            farthest: Number,
            clickSquare: Function
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
    }
</script>

<style scoped>
</style>
