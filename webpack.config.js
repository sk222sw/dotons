const path = require("path");
const webpack = require("webpack");

const PATHS = {
  app: path.join(__dirname, 'app'),
  styles: path.join(__dirname, 'public', "stylesheets"),
  build: path.join(__dirname, 'public', 'javascripts')
};
module.exports = {
  context: path.join(__dirname, "app"),
  debug: true,
  devtool: "eval-source-map",
  entry: {
    app: "./index.js"
  },
  output: {
    path: PATHS.build,
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel", "eslint-loader"],
        include: PATHS.app
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"],
        include: PATHS.app
      }
    ]
  },
  plugins: [
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
  ]
};
