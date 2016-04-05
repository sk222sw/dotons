const webpack = require("webpack");
const path = require("path");

const webpackDevConfig = require("./webpack.config.js");

const PATHS = {
  app: path.join(__dirname, 'app'),
  styles: path.join(__dirname, 'public', "stylesheets"),
  build: path.join(__dirname, 'public', 'javascripts')
};

module.exports = {
  context: webpackDevConfig.context,
  debug: false,
  entry: webpackDevConfig.entry,
  output: webpackDevConfig.output,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: PATHS.app
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"],
        include: PATHS.app
      }
    ]
  },  
  plugins: webpackDevConfig.plugins
};
