// vue.config.js
const path = require('path')

module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    },
    configureWebpack: {
        devServer: {
            // clientLogLevel: 'warning',
            historyApiFallback: true,
            hot: true,
            inline: false,  // false为关闭热更新
        }
    }
}

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/imports.scss'),
            ],
        })
}
