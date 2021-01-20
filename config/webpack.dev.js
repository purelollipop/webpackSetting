const path = require('path');

const webpack = require('webpack');
const {merge} = require('webpack-merge');
const commonObj = require('./webpack.common');

const devObj = {
    //打包模式  默认 production 文件会被压缩
    //如果不配置 会警告 但是 不会影响打包
    //development 不会被压缩
    // mode:process.env.NODE_ENV === 'production'?'production':"development",
    mode:"development",
    //在development模式下，sourcemap是默认开启的
    //devtool:process.env.NODE_ENV === 'production'?'cheap-module-source-map':'eval-cheap-module-source-map',
    devtool:'eval-cheap-module-source-map',
//输出文件
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, '../buldtext'),
        chunkFilename: '[name].js'
        // path: './bundle'
    },

    devServer:{
        //配置热加载服务器地址
        contentBase:path.join(__dirname,'bundle'),
        // contentBase:'./bundle',
        //自动打开浏览器地址
        open:true,
        //开启https
        // https:true,
        //开启热更新
        hot:true,
        //开启热更新不刷新浏览器，只模块改变
        hotOnly: true,
        //开启热更新通信联系
        // inline:true,
        headers: {
            'test-web-01': 'web01'
        },
        proxy:{
            '/web01':{
                target:'http://localhost:3000/',
                pathRewrite:{'/web01':'/'},
            }
        }
    },
    module:{
        rules:[
            //样式文件打包
            {
                //识别 以 css 结尾的文件
                test:/\.css$/,
                //css样式文件需要两个loader来处理 所以此处许哟啊使用数组形式
                //css loader 用来将多个css文件合并到一起 合并成一个css文件
                //style loader 用来将 cssloader 合并的文件挂在到head标签里面
                //     !!! loader 是一个从下到上 从右到左的执行顺序 !!!!
                use:['style-loader','css-loader','sass-loader'],

            },
            {
                //识别 以 css 结尾的文件
                test:/\.scss$/,
                //css样式文件需要两个loader来处理 所以此处使用数组形式
                //css loader 用来将多个css文件合并到一起 合并成一个css文件
                //style loader 用来将 cssloader 合并的文件挂在到head标签里面
                use:[
                    'style-loader',
                    {
                        loader:'css-loader',
                        options:{
                            importLoaders:2
                        }
                    },
                    'sass-loader',
                    //浏览器css前缀添加loader
                    // 'postcss-loader'
                ],

            },
        ]
    },
    //插件数组，所有的插件使用时候要在这里实例化一次
    plugins:[
        //开发模式下热更新
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization:{
        /*生产环境tree shaking 会自动开启 所以此处开发环境要独自配置*/
        //未被导出模块不打包
        // usedExports:true,
    }
}

// module.exports = Object.assign(devObj,commonObj);
module.exports = merge(devObj,commonObj);