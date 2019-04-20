<template>
    <div class="page index">
        <div class="user" v-if="userInfo">
            <span class="user_lv">等级{{userInfo.hp}}</span>
            <span class="user_nickname">{{userInfo.username}}</span>
        </div>

        <h1 class="page_tt">Web Wars</h1>

        <div class="nav">
            <button class="btn" @click="play">开始游戏</button>
            <button class="btn">查看排行</button>
        </div>
        <div class="menu">
            <div class="menu_item">好友</div>
            <div class="menu_item">牌组</div>
            <div class="menu_item">帮助</div>
        </div>
    </div>
</template>

<script>
    import {getUserInfo, createRoom} from '../api'

    export default {
        name: "index",
        data() {
            return {
                userInfo: null
            }
        },
        created() {
            getUserInfo().then(res => {
                this.userInfo = res.data
            }).catch(e => {
            })
        },
        methods: {
            play() {
                createRoom().then(res => {
                    let {data} = res
                    if (data) {
                        let {roomId} = data

                        this.$router.push({
                            path: '/game',
                            query: {
                                roomId
                            }
                        })
                    } else {
                        this.$toast('创建房间失败')
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .user {
        text-align: left;
        font-size: rem(26);
        line-height: rem(60);
        border-bottom: $baseborder;
        &_lv {
            font-weight: 700;
            margin-right: rem(20);
        }
    }

    .page_tt {
        margin: rem(100);
        font-size: rem(60);
        text-align: center;
        text-shadow: 0 rem(6) rem(6) #000;
    }

    .nav {
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: column;
        .btn {
            margin: rem(20) 0;
        }
    }

    .menu {
        margin-top: rem(100);
        display: flex;
        align-items: center;
        justify-content: space-around;
        &_item {
            font-size: rem(30);
        }
    }
</style>
