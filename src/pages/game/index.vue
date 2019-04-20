<script>
    const ROOM_STATUS = {
        WAIT: 0,
        PLAY: 1,
    }

    import waitPage from './wait'
    import playPage from './play'

    import socket from '../../api/socket'

    export default {
        name: "game-index",
        data() {
            return {
                roomStatus: ROOM_STATUS.WAIT,
                users: []
            }
        },
        created() {
            socket.onReady((users) => {
                console.log('ready ', users)
                this.users = users
                this.roomStatus = ROOM_STATUS.PLAY
            })
        },
        render(h) {
            let {roomStatus} = this

            if (roomStatus === ROOM_STATUS.WAIT) {
                return h(waitPage)
            } else if (roomStatus === ROOM_STATUS.PLAY) {
                return h(playPage, {
                    props: {
                        users: this.users
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
