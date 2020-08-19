//详细的webpack.config.js结构分析：
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
    devtool: 'source-map', //由于打包后的代码是合并以后的代码，不利于排错和定位，只需要在config中添加，这样出错以后就会采用source-map的形式直接显示你出错代码的位置。
    noParse:[/jquery/],//表示跳过jquery,不对其进行编译,这样可以提高打包的速度
    //页面入口文件配置
    entry: {
        page1: ["./js/all.js",'vue.js',],
        //page2: ["./src/index.js", "./src/main.js"],支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
    },
    //入口文件输出配置
    output: {
        path: "./dist/js/page",
        filename: "[name].bundle.js", // page1.bundle.js 和 page2.bundle.js，并存放到 ./dist/js/page 文件夹下。
        publicPath: "/dist/" //网站运行时的访问路径。
    },
    resolveLoader: {
        //指定默认的loader路径，否则依赖走到上游会找不到loader
        root: path.join(__dirname, 'node_modules'),
        // alias: { //给自己写的loader设置别名
        //     "seajs-loader": path.resolve(__dirname, "./web_modules/seajs-loader.js")
        // }
    },
    //新建一个开发服务器，并且当代码更新的时候自动刷新浏览器。
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        hot: true,
        inline: true,
        progress: true,
        port: 9090 //端口你可以自定义
    },
    module: {
        // module.loaders 是最关键的一块配置。它告知 webpack每一种文件都需要使用什么加载器来处理：
        loaders: [{
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, //.css 文件使用 style-loader 和 css-loader 来处理.
            //{ test: /\.css$/, loader: 'style!css' },其他写法1、"-loader"其实是可以省略不写的，多个loader之间用“!”连接起来。
            //{ test: /\.css$/, loaders: ["style", "css"] }，其他写法2、用loaders数组形式;
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理。
            //在chrome中我们通过sourcemap可以直接调试less、sass源文件文件
            {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less?sourceMap'
            }, //.less 文件使用 style-loader、css-loader 和 less-loader 来编译处理
            //.js 文件使用babel-loader来编译处理,设置exclude用来排除node_modules这个文件夹中的代码
            {
                test: /\.js$/,
                loader: 'babel!jsx',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: "jsx-loader?harmony"
            }, //.jsx 文件使用 jsx-loader 来编译处理
            {
                test: /\.json$/,
                loader: 'json'
            },
            //{ test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=8192'}, //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                } //设置图片名称扩展名
            },
            {
                test: /\.jade$/,
                loader: "jade-loader"
            }, //.jade 文件使用 jade-loader 来编译处理
            {
                test: /\.ejs$/,
                loader: "ejs-loader"
            }, //.ejs 文件使用 ejs-loader 来编译处理
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader"
            }, //.handlebars 文件使用handlebars-loader来编译处理handlebars模板文件
            {
                test: /\.dot$/,
                loader: "dot-loader"
            }, //.dot 文件使用 dot-loader 来编译处理dot模板文件
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }, //.vue 文件使用 vue-loader 来编译处理
            {
                test: /\.coffee$/,
                loader: 'coffee-loader'
            }, //.coffee 文件使用 coffee-loader 来编译处理
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.woff$/,
                loader: "file"
            },
            {
                test: /\.ttf$/,
                loader: "file"
            },
            {
                test: /\.eot$/,
                loader: "file"
            },
            {
                test: /\.svg$/,
                loader: "file"
            }
        ]
    },
    //分内置插件和外置插件
    plugins: [
        //使用了一个 CommonsChunkPlugin 的插件，它用于提取多个入口文件的公共脚本部分，然后生成一个common.js来方便多页面之间进行复用。
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin({ //压缩文件
            compressor: {
                warnings: false, //supresses warnings, usually from module minification
            },
            except: ['$super', '$', 'exports', 'require'] //排除关键字(可选)
        }),
        new webpack.DefinePlugin({ // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
        }),
        new webpack.ProvidePlugin({ //把一个全局变量插入到所有的代码中,支持jQuery plugin的使用;使用ProvidePlugin加载使用频率高的模块
            //provide $, jQuery and window.jQuery to every script
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.NoErrorsPlugin(), //允许错误不打断程序
        new TransferWebpackPlugin([ //把指定文件夹下的文件复制到指定的目录
            {
                from: 'www'
            }
        ], path.resolve(__dirname, "src")),
        new HtmlwebpackPlugin({ //用于生产符合要求的html文件;
            title: 'Hello World app',
            filename: 'assets/admin.html'
        })
    ],
    //其它解决方案配置
    resolve: {
        root: 'E:/github/flux-example/src', //绝对路径, 查找module的话从这里开始查找(可选)
        extensions: ['', '.js', '.html', '.css', '.scss'], //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        alias: { //模块别名定义，方便后续直接引用别名，无须多写长长的地址//后续直接 require('AppStore') 即可
            AppStore: 'js/stores/AppStores.js',
            ActionType: 'js/actions/ActionType.js',
            AppAction: 'js/actions/AppAction.js'
        },
        modulesDirectories: [ //取相对路径，所以比起 root ，所以会多很多路径。查找module(可选)
            'node_modules',
            'bower_components',
            'lib',
            'src'
        ]
    }

};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}