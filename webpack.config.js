const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('css/[name].css');
const CleanWebpackPlugin = require("clean-webpack-plugin");

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
    },
    /*optimization:{
        splitChunks:{
            cacheGroups:{
                vendor:{
                    test:'/node_modules/',
                    chunks:'initial',
                    name:'vendor',
                    priority:10
                },
                utils:{
                    chunks:'initial',
                    name:'utils',
                    minSize:0
                }
            }
        }
    },*/
    module: {
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader',
                include:'/src/',  //只转化src目录下的js
                exclude:'/node_modules/' //排除掉node_modules，优化打包速度

            },
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
        new webpack.HotModuleReplacementPlugin(),// 热替换，热替换不是刷新
        /*new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html',
            hash: true
        }),
        extractCSS,*/
        new CleanWebpackPlugin(['dist'])
    ],
    devServer: {  // 开发服务器配置
        contentBase: './dist',
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true    //开启热更新
    },           
    mode: 'development'      // 模式配置
}