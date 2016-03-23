const path = require("path");
const nodeModulesPath = path.resolve(__dirname, "node_modules");
const buildPath = path.resolve(__dirname, "public", "build");
const mainPath = path.resolve(__dirname, "app", "main.js");

const config = {
  devtool: "source-map",
  entry: mainPath,
  output: {
    path: buildPath,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: [nodeModulesPath]
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};

module.exports = config;
