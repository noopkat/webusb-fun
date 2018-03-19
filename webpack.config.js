const path = require('path');

module.exports = {
  entry: './oled.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webusb.bundle.js'
  },
  devtool: 'source-map',
  node: {
    console: false,
    global: true,
    process: true,
    __filename: "mock",
    __dirname: "mock",
    repl: "empty",
    Buffer: true,
    setImmediate: true,
    fs: 'empty',
    child_process: 'empty'

  }
};
