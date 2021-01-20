const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpack = require('webpack');

let htmlWebpackPluginObj = {
    //标题
    title:'my app',
    //模板
    template: 'ind.html',
    //输出名字规范
    filename:'index.html',
    //chunk名字
    // chunkFilename:[name].chunk.js,
    scriptLoading:'defer',
    inject:true,
    hash:true,
    cache:true,
    meta: {
        charset: { charset: 'utf-8' },
        viewport: 'width=device-width, initial-scale=1',
    },
    favicon: path.join(__dirname,'../favicon.ico')
};



module.exports = {
    //入口文件
    entry: {
        mainone:'./ind.js',
    },

    //打包警告 当超出阈值
    // performance:false,
    module:{
        //规则 数组类型 可以有很多规则
        rules:[
            // {
            //     //识别 以 jpg 结尾的文件
            //     test:/\.(jpg|png|gif|svg)$/,
            //     //使用什么loader 来处理
            //     use:{
            //         loader:'file-loader',
            //         options:{
            //             //placeholdel 占位符
            //             name: '[name].[hash:5].[ext]',
            //             //输出到另一个文件地址 避免和 output 放一起
            //             // ./ 意味bundle下面的 output同级的目录中
            //             outputPath:'fileImages/',
            //             publicPath:'fileImages/',
            //         }
            //     }
            // },
            //jpg 图片打包规则
            {
                //识别 以 jpg 结尾的文件
                test:/\.(jpg|png|gif|svg)$/,
                //使用什么loader 来处理
                use:{
                    loader:'url-loader',
                    options:{
                        //placeholdel 占位符
                        name: '[name].[hash:10].[ext]',
                        //输出到另一个文件地址 避免和 output 放一起
                        // ./ 意味bundle下面的 output同级的目录中
                        // exclude: [resolve('./src/icons/icons')],
                        outputPath:'./baseImages',
                        // encoding:'base64',
                        publicPath:'./baseImages',
                        //文件当大于2k 则在url-loader中不处理，file-loader 来处理
                        // fallback: require.resolve('file-loader'),
                        //limit 大小限制 如果 小于 则打包进maintwo 如果大于 则进入outputPath
                        limit:2048
                    }
                }
            },


            {
                test: require.resolve('../src/js/utils.js'),
                loader: 'imports-loader',
                options: {
                    // imports: [
                    //     'default jquery $',
                        // 'default window win',
                        // 'named lib_3 lib2_method_1',
                        // 'named lib_3 lib2_method_2 lib_2_method_2_short',
                        // 'namespace lib_4 my_namespace',
                        // 'side-effects lib_5',
                        // {
                        //     syntax: 'default',
                        //     moduleName: 'angular',
                        //     name: 'angular',
                        // },
                    // ],
                    imports:[{
                        moduleName: 'jquery',
                        name: '$',
                    },
                    //     {
                    //     moduleName: 'window',
                    //     name: 'wrapper',
                    // }
                    ],
                    // wrapper: 'window',
                },
            },
            {
                test:require.resolve('../src/add.js'),
                // use:'exports-loader?type=commonjs&exports[]=file&exports[]=multiple|helpers.parse|parse'
                use:[
                    // {loader:'imports-loader?www=>window'},
                    {loader:'exports-loader?type=commonjs&exports[]=file&exports[]=multiple|helpers.parse|parse&exports[]=add'},
                ]
            },
            // babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                // use: {
                //    loader: "babel-loader",
                //     options: {
                //         presets: ['@babel/preset-env']
                //     }
                // }
            }
        ]
    },
    optimization:{
        usedExports:true,
       //代码拆分，webpack 遇到公用模块会自动识别并拆分
       //  splitChunks:{chunks:'all'},
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            // minRemainingSize: 0,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            name:true,
            // enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    filename:'vendors.js'
                },
                // defaultVendors:false,
                // vendors:false,
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true,
                    filename:'default_intin.js',
                },
                // default:false,

            }
        }
    },
    //插件数组，所有的插件使用时候要在这里实例化一次
    plugins:[
        new htmlWebpackPlugin(htmlWebpackPluginObj),
        new CleanWebpackPlugin(),
        //打包bundle 解析,会生成分析包大小的页面
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            $:'jquery'
        })
    ],
}