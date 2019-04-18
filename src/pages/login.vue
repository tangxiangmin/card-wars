<template>
    <div class="page">
        <h1 class="page_tt">login</h1>
        <form class="form">
            <div class="form_item">
                <input type="text" class="input" v-model="account" placeholder="请输入账号">
            </div>
            <div class="form_item">
                <input type="text" class="input" v-model="password" placeholder="请输入密码">
            </div>
            <div class="mt-base">
                <button type="button" class="btn btn-full bg-base" @click="submit">登录</button>
            </div>
        </form>
    </div>
</template>

<script>
    import {login} from '../api'

    export default {
        name: "login",
        data() {
            return {
                account: 'root',
                password: 'root'
            }
        },
        methods: {
            async submit() {
                let {account, password} = this
                let token = await login({account, password})
                if (token) {
                    this.$router.replace('/')
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .input {
        display: block;
        width: 100%;
        font-size: rem(26);
        line-height: rem(80);
        border: none;
        border-bottom: $baseborder;
    }
</style>
