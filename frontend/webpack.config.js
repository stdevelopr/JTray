const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.join(__dirname, "../backend/static"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "../templates/index.html",
      template: "public/index.html"
    })
  ]
};
