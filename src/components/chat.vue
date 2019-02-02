<template>
    <div class="chat">
        <div class="chat_bd">
            <ul v-for="(item,index) in chatList" :key="index">
                <li>{{item.userName}}:{{item.content}}</li>
            </ul>
        </div>

        <div class="chat_ft">
            <input type="text" v-model="message">
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
    import client from '../socket/index'
    import urlKit from '../util/urlKit'

    export default {
        name: "chat",
        props: {},
        data() {

            return {
                chatList: [],
                message: ''
            }
        },
        created() {
            client.onChat((data) => {
                this.chatList.push(data)
            })
        },
        methods: {
            sendMessage() {
                let params = {
                    content: this.message,
                    userName: urlKit.getParam('uid')
                }

                client.chat(params)
            },
        }
    }
</script>

<style scoped lang="scss">

    .chat {
        display: flex;
        flex-direction: column;

        position: fixed;
        z-index: 99;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);

        font-size: rem(30);
        color: #fff;

        &_bd {
            flex: 1;
        }
        &_ft {
            height: rem(150);
        }
    }
</style>
