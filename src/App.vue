<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',

    }
</script>

<style lang="scss">
    /* ---rem--- */
    html {
        font-size: calc((100vw / 750) * 100);
    }

    @media screen and (min-width: 800px) {
        html {
            font-size: 100px;
        }
        .page {
            width: 800px;
            margin: 0 auto;
        }
    }

    /* ---reset--- */
    html {
        //height: 100%;
    }

    body {
        //height: 100%;
        min-height: 100vh;
        color: #101010;
    }

    // 去除浏览器外边距
    body,
    h1, h2, h3, h4, h5, h6,
    p, dl, dd {
        margin: 0;
    }

    ul, ol {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    // HTML新增标签元素在IE9一下正确显示
    article,
    aside,
    footer,
    header,
    nav,
    section,
    main {
        display: block;
    }

    // 去除某些浏览器对图片增加的边框
    img {
        border: 0;
    }

    // 解决浏览器默认的样式导致超链接无法继承其父元素文本样式
    a {
        color: inherit;
        background: transparent;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    // 解决表单元素内字体样式无法继承的问题，但在IE6，7下无法生效
    input, button, textarea, select, optgroup {
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        color: inherit;
        background-color: inherit;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-appearance: none;
    }

    textarea {
        resize: vertical;
    }

    // 移除元素获取焦点时的外轮廓
    :focus {
        outline: 0;
    }

    // 选择盒子模型，好想使用"*"统配选择符
    * {
        box-sizing: border-box;
    }

    /* ---end reset--- */
</style>
