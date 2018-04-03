var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.config');
var port = process.env.PORT // PORT=3001 node ./build/server.js
    || (process.argv[2] && process.argv[2].split('=')[1]) // node ./build/server.js --port=3001
    || process.env.npm_package_config_port
    || 3000;

var devEntries = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:' + port + '/',
    'webpack/hot/dev-server'
];

Object.keys(config.entry).forEach(function (key) {
    var mods = config.entry[key];
    config.entry[key] = devEntries.concat(Array.isArray(mods) ? mods : [mods]);
});

var fecsLoader = {
    loader: 'fecs-loader',
    options: {
        failOnError: false,
        failOnWarning: false
    }
};

var styleLoader = {
    loader: 'style-loader',
    options: {module: true}
};
config.module.rules = [
    {
        test: /\.(jpe?g|png|gif|svg|cur)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    prefix: 'img/'
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
                    prefix: 'font/'
                }
            }
        ]
    }
].concat(config.module.rules);

config.module.rules.forEach(function (rule) {
    if (String(rule.test).match(/\\\.(css|less|styl|scss)\b/)) {
        rule.use.forEach(function (loader) {
            loader.options.sourceMap = true;
        });
        rule.use.unshift(styleLoader);
        rule.use.push(fecsLoader);
    }
    else if (String(rule.use).match(/babel-loader/)) {
        rule.use = Array.isArray(rule.use) ? rule.use : [rule.use];
        rule.use.unshift('react-hot-loader/webpack');// module exports are registered
        rule.use.push(fecsLoader);
    }
});

config.output.publicPath = 'http://localhost:' + port + '/static/dist/';
config.output.devtoolModuleFilenameTemplate = function (info) {
    return "file:///" + encodeURI(info.absoluteResourcePath);
};
config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
    return "file:///" + encodeURI(info.absoluteResourcePath) + '?' + info.hash;
};
config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({
        filename: './build/webpack-stats.json',
        indent: 4
    })
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
config.devtool = 'cheap-module-source-map';
config.mode = "development";
module.exports = config;
