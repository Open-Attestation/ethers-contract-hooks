module.exports = {
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    filename: "index.js",
    libraryTarget: "umd",
    library: "decentralizedRenderer"
  },
  externals: {
    react: "react",
    "react-dom": "react-dom"
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
