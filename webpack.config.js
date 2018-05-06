const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('css/[name].css');

module.exports = {
    //entry: './src/index.js',               // 入口文件
    entry:{
        index:'./src/js/index.js',
        login:'./src/js/login.js'
    },
    output: {
        //添加hash可以防止文件缓存，每次都会生成4位的hash串
        //filename:'[name][hash:4].js',
        filename:'[name].js',
        path:path.resolve(__dirname,'dist')
    },              // 出口文件
    module: {
        rules:[
            {
                test:/\.css$/,
                //use:extractCSS.extract(['style-loader','css-loader']),
                use:extractCSS.extract({
                    use:'css-loader',
                    publicPath: '../'  //解决css背景图的路径问题
                })

            },
            {
                test:/\.(jpe?g|png|gif)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:8192,
                            outputPath:'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: [
                    {
                        loader:'html-withimg-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash: true
        }),
        extractCSS
    ],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}