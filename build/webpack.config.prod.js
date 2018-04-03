var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
var ImageminPlugin = require('imagemin-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var config = require('./webpack.config');

var autoImports = [
    'whatwg-fetch',
    '@babel/polyfill'
];

Object.keys(config.entry).forEach(function (key) {
    var mods = config.entry[key];
    config.entry[key] = autoImports.concat(Array.isArray(mods) ? mods : [mods]);
});

config.module.rules = [
    {
        test: /\.(jpe?g|png|gif|svg|cur)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'img/[name].[hash:6].[ext]'
                }
            }
        ]
    },
    {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'font/[name].[hash:6].[ext]'
                }
            }
        ]
    }
].concat(config.module.rules);

config.module.rules.forEach(function (rule) {
    if (String(rule.test).match(/\\\.(css|less|styl|scss)\b/)) {
        rule.use = ExtractTextPlugin.extract({use: rule.use});
    }
});

config.plugins = [
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    new HashedModuleIdsPlugin(),
    // new CommonsChunkPlugin({
    //     names: ['lib', 'manifest'],
    //     minChunks: Infinity
    // }),
    new ImageminPlugin({
        gifsicle: {
            interlaced: true,
        },
        jpegtran: {
            progressive: true,
        },
        svgo: null
    }),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
].concat(config.plugins);

config.optimization = {
    splitChunks: {
        chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
        minSize: 0,                // 最小尺寸，默认0
        minChunks: 1,              // 最小 chunk ，默认1
        maxAsyncRequests: 1,       // 最大异步请求数， 默认1
        maxInitialRequests: 1,    // 最大初始化请求书，默认1
        name: () => {},              // 名称，此选项课接收 function
        cacheGroups: {                 // 这里开始设置缓存的 chunks
        priority: "0",                // 缓存组优先级 false | object |
        vendor: {                   // key 为entry中定义的 入口名称
            chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
            name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
            minSize: 0,
            minChunks: 1,
            enforce: true,
            maxAsyncRequests: 1,       // 最大异步请求数， 默认1
            maxInitialRequests: 1,    // 最大初始化请求书，默认1
            reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
        }
        }
    }
};

config.output.filename = '[name].[chunkhash:8].js';
config.output.chunkFilename = '[name].[chunkhash:8].chunk.js';
config.performance = {
    hints: 'warning'
};
config.profile = true;
config.mode = "production";
module.exports = config;
