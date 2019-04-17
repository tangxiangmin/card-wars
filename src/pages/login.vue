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
    export default {
        name: "login",
        data() {
            return {
                account: '',
                password: ''
            }
        },
        methods: {
            submit() {
                console.log(this.$data)
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
