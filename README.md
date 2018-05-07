https://juejin.im/post/5adea0106fb9a07a9d6ff6de

官方文档

https://webpack.js.org

Webpack傻瓜式指南
https://github.com/vikingmute/webpack-for-fools


## 安装webpack
- 建议node版本8.2以上
- 在项目文件夹下执行``npm init``，生成package.json
- 安装webpack和webpack-cli
  ```
  npm install webpack webpack-cli -D
  ```
  npm install -D 是 npm install --save-dev 的简写，是指安装模块并保存到 package.json 的 devDependencies中，主要在开发环境中的依赖包
## webpack的常规配置
初始打包配置文件
```
// webpack.config.js

const path = require('path');

module.exports = {
    entry: './src/index.js',    // 入口文件
    output: {
        filename: 'bundle.js',      // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    }
}
```
## 配置执行文件

开发环境中我们打包编译会使用``npm run dev``命令，所以可以配置packae.json。

- ``npm run build``生成环境上打包执行会生成对应的打包文件
- ``npm run dev``开发环境打包执行,由于devServer帮我们把文件放到内存中了，所以并不会输出打包后文件

执行npm run build后，就会生成dist目录

## 多入口文件

- 没有关系的但是要打包到一起去的，可以写一个数组，实现多个文件打包，打包后的文件都合成了一个
- 打包后的文件都合成了一个
```
const path = require('path');
module.exports = {
    //entry: './src/index.js',               // 入口文件
    entry:{
        index:'./src/index.js',
        login:'./src/login.js'
    },
    output: {
        filename:'[name].js',
        path:path.resolve('dist')
    },              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}
```
执行npm run build后，会生成打包好的两个js文件，如图所示


## html打包功能

- 安装html-webpack-plugin插件
  ```
  npm install html-webpack-plugin -D
  ```
- 在配置文件webpack.config.js里添加引用
  ```
  const path = require('path');

  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    entry:{
        index:'./src/index.js',
        login:'./src/login.js'
    },
    output: {
        
        filename:'[name].js',
        path:path.resolve('dist')
    },
    module: {},
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash: true
        })
    ],
    devServer: {},
    mode: 'development'
  }
  ```
  - [name]就可以将出口文件名和入口文件名一一对应
  - 添加hash可以防止文件缓存，每次都会生成4位的hash串 
  ``filename:'[name][hash:4].js'``

执行npm run build后，会生成html文件，如图所示


## 引用CSS文件
- 下载解析css样式的loader
  ```
  npm install style-loader css-loader -D
  // 引入less文件的话，也需要安装对应的loader
  npm install less less-loader -D
  ```
- 配置webpack.config.js
  ```
    module: {
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']}
        ]
    }
  ```
  - test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
  - use 属性，表示进行转换时，应该使用哪个 loader。
 
  - 此时打包后的css文件是以行内样式style的标签写进打包后的html页面中，如果样式很多的话，我们更希望直接用link的方式引入进去，这时候需要 把css拆分出来
  - extract-text-webpack-plugin插件相信用过的人都知道它是干什么的，它的功效就在于会将打包到js里的css文件进行一个拆分


## 打包多个CSS文件
- 安装
  ```
  // @next表示可以支持webpack4版本的插件
   npm i extract-text-webpack-plugin@next -D
  ```
- 修改配置文件
  ```
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
                    use:extractCSS.extract({
                        use:'css-loader'
                    })
    
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
  ```
  执行npm run build命令，会在css文件夹里生成对应的.css文件
  
## 引用图片  
需要安装对应的文件loader
```
npm install file-loader url-loader -D
```
如果是在css文件里引入的如背景图之类的图片，就需要指定一下相对路径
```
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
            }
        ]
    }
```
- ``limit`` 小于对应值的图片自动转成base64格式，单位kb，并且不会存在实体图片
- ``outputPath``图片打包后存放的目录

在css中指定了publicPath路径这样就可以根据相对路径引用到图片资源了，如下图所示


## 页面img引用图片
页面中经常会用到img标签，img引用的图片地址也需要一个loader 
```
npm install html-withimg-loader -D
```
```
 {
    test: /\.(htm|html)$/,
    use: 'html-withimg-loader'
}
```


## 转义ES6
我们在大量的使用着ES6及之后的api去写代码，由于低版本浏览器的存在，不得不需要转换成兼容的代码，于是就有了常用的Babel。

- 安装Babel
  ```
  npm install babel-core babel-loader babel-preset-env babel-preset-stage-0 -D
  ```
  
  ```
  {
    test:/\.js$/,
    use:'babel-loader',
    include:'/src/',  // // 只转化src目录下的js

  }
  ```
  
## 清理旧版本打包文件
在我们每次npm run build的时候都会在dist目录下创建很多打好的包，如果积累过多可能也会混乱

所以应该在每次打包之前将dist目录下的文件都清空，然后再把打好包的文件放进去

这里提供一个clean-webpack-plugin插件
```
npm install clean-webpack-plugin -D
```
```
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        // 打包前先清空
        new CleanWebpackPlugin('dist')  
    ]
}
```

## 启动静态服务器
启动一个静态服务器，默认会自动刷新，就是说你对html,css,js文件做了修改并保存后，浏览器会默认刷新一次展现修改后的效果。

执行npm run dev命令后，会启动静态服务器，我们访问localhost:3000端口就可以看到开发的页面内容了。

如果devServer里open设为true后，会自动打开浏览器
```
module.exports = {
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true    //开启热更新
    }
}
```
当然在npm run dev命令下，打包的文件存在于内存中，并不会产生在dist目录下


**热更新和自动刷新的区别**

## resolve解析

在webpack的配置中，resolve我们常用来配置别名和省略后缀名
```
module.exports = {
    resolve: {
        // 别名
        alias: {
            $: './src/jquery.js'
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
}
```
这个配置在webpack中比较简单

## 提取公共代码