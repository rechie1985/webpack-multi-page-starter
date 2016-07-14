var config = require('./webpack.dev.config.js');
var webpack = require("webpack");
var WebpackDevServer = require('webpack-dev-server');
var exec = require('child_process').exec;
var fs = require('fs');

var compiler = webpack(config)
new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    },
    hot: true,
    quiet: false,
    noInfo: false,
    // 实现mock server的功能，可以自己扩展
    // @TODO 增加简单的mock功能
    proxy: {
      '/some/path*': {
        secure: false,
        bypass: function(req, res, proxyOptions) {
          console.log(req.headers.accept)
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return './src/pages/index.html';
        }
      }
    }
  }
}).listen(8080, "localhost", function(err) {
    if(err) {
      return console.log("webpack-dev-server", err);
    }
    console.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
});

fs.watch('./src/views/', function() {
    exec('webpack --config webpack.dev.config.js --progress --hide-modules', function(err, stdout, stderr) {
        if (err) {
            console.log(stderr);
        } else {
            console.log(stdout);
        }
    });
});
