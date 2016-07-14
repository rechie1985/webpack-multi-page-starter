
var glob = require('glob');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

function addEntryToConfig(config, isDev) {

  var files = glob.sync('src/views/**/*.ejs', {ignore: 'src/views/common/*.ejs'})

  files.forEach((file, index) => {
    // 获取当前文件名
    var filename = path.basename(file, '.ejs');
    var dir = path.dirname(file).replace('src/views', '');

    // 写入entry
    var chunkName = dir + path.sep + filename;
    var chunkDir = './src/js' + chunkName + '.js';
    var entryName = chunkName.replace('/', '');
    config.entry[entryName] = isDev ? [chunkDir, hotMiddlewareScript] : [chunkDir];


    // 给每一个入口文件都增加HtmlWebpackPlugin配置
    var htmlPlugin = new HtmlWebpackPlugin({
      filename: 'pages/' + dir + path.sep + filename + '.html',
      template: file,
      chunks: [entryName, 'vendor', ],
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    });
    config.plugins.push(htmlPlugin);
  });
  return config;
}

module.exports = addEntryToConfig;
