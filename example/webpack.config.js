/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  // ...webpackConfig,
  entry: path.join(__dirname, "./app.tsx"),
  externals: {},
  output: {
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "."),
    compress: true,
    port: 9001,
    index: "index.html"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
