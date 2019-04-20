<template>
    <div class="page">
        <div class="room">
            <div class="room_num">{{roomId}}</div>
            <div class="room_msg">等待对手加入房间...</div>
        </div>
    </div>
</template>

<script>
    import socket from '../../api/socket'

    export default {
        name: "game-wait",
        data() {
            return {}
        },
        mounted() {
            let params = {
                roomId: this.roomId,
                uid: 1
            }

            socket.enterRoom(params)
        },
        computed: {
            roomId() {
                return this.$route.query.roomId
            }
        }
    }
</script>

<style scoped lang="scss">
    .room {
        text-align: center;
        &_num {
            margin: rem(100) 0;
            font-size: rem(60);
        }
        &_msg {

            font-size: rem(30);
        }
    }
</style>
