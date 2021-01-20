const path = require('path');
const {merge} = require('webpack-merge');
const commonObj = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const produObj = {
    //输出文件
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, '../bundle'),
        chunkFilename: '[name].[hash].js'
        // path: './bundle'
    },
    //打包模式  默认 production 文件会被压缩
    //如果不配置 会警告 但是 不会影响打包
    //development 不会被压缩
    // mode:process.env.NODE_ENV === 'production'?'production':"development",
    // mode:"development",
    mode:"production",
    //在development模式下，sourcemap是默认开启的
    //devtool:process.env.NODE_ENV === 'production'?'cheap-module-source-map':'eval-cheap-module-source-map',
    devtool:'cheap-module-source-map',
    // devtool:'eval-cheap-module-source-map',
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
                use:[MiniCssExtractPlugin.loader,'css-loader','sass-loader'],
                // use:['style-loader','css-loader','sass-loader'],
            },
            {
                //识别 以 css 结尾的文件
                test:/\.scss$/,
                //css样式文件需要两个loader来处理 所以此处使用数组形式
                //css loader 用来将多个css文件合并到一起 合并成一个css文件
                //style loader 用来将 cssloader 合并的文件挂在到head标签里面
                use:[
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
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
    optimization:{
        splitChunks:{
            cacheGroups:{
                styles:{
                    name:'styles',
                    test:'/\.css$/',
                    chunks:'all',
                    priority: -10,
                    //忽略掉默认的参数
                    enforce:true,
                }
            }
        },
        //开发模式下也压缩
        // minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...`
            // syntax to extend existing minimizers
            // (i.e. `terser-webpack-plugin`), uncomment the next line
            new CssMinimizerPlugin({
                // test: /\.css\.css$/i,
            }),
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
            })
            // new OptimizeCssAssetsPlugin({
                // assetNameRegExp: /\.optimize\.css$/g,
                // cssProcessor: require('cssnano'),
                // cssProcessorPluginOptions: {
                //     preset: ['default', { discardComments: { removeAll: true } }],
                // },
                // canPrint: true
            // })
        ],
    },
    //插件数组，所有的插件使用时候要在这里实例化一次
    plugins:[
        new MiniCssExtractPlugin({
            // filename:'[name].[chunkhash:8].css',
            //通过filename css/ 输出到一个css文件夹
            filename:'css/[name].css',
            chunkFilename:'css/[name].[hash].css',
            // ignoreOrder: false
        }),

    ],
}

module.exports = merge(produObj,commonObj);