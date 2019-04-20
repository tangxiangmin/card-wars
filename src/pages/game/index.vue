<script>
    const ROOM_STATUS = {
        WAIT: 0,
        PLAY: 1,
    }

    import waitPage from './wait'
    import playPage from './play'

    export default {
        name: "game-index",
        data() {
            return {
                roomStatus: ROOM_STATUS.WAIT
            }
        },
        render(h) {
            let {roomStatus} = this

            let pageComponent
            if (roomStatus === ROOM_STATUS.WAIT) {
                pageComponent = waitPage
            } else if (roomStatus === ROOM_STATUS.PLAY) {
                pageComponent = playPage
            }

            return h(pageComponent)
        }
    }
</script>

<style scoped>

</style>
