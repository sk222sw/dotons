const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: path.join(__dirname, "app", "stylesheets"),
  styles: path.join(__dirname, 'public', "stylesheets"),
  build: path.join(__dirname, 'public', 'javascripts')
};
console.log(PATHS.style);
module.exports = {
  context: path.join(__dirname, "app"),
  debug: true,
  // devtool: "eval-source-map",
  entry: {
    app: "./index.js",
    designer: ["./designer.js", "./imageUploader.js"],
    main: [
      "./stylesheets/vendor/normalize.css",
      "./stylesheets/vendor/skeleton.css",
      "./stylesheets/style.css"
    ]
  },
  output: {
    path: PATHS.build,
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: PATHS.app,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader"),
        include: PATHS.style
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NOVE_ENV: JSON.stringify("production")
      }
    }),
    new ExtractTextPlugin("../stylesheets/[name].css")
  ]
};

exports.PATHS = PATHS;
