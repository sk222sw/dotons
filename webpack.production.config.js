const webpack = require("webpack");
const path = require("path");

const webpackDevConfig = require("./webpack.config.js");

module.exports = {
  context: webpackDevConfig.context,
  debug: false,
  entry: webpackDevConfig.entry,
  output: webpackDevConfig.output,
  module: webpackDevConfig.module,
  plugins: webpackDevConfig.plugins
};
