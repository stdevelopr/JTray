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
      },
      {
        // modular css
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          { loader: "sass-loader" }
        ],
        include: /\.module\.scss$/
      },
      {
        // global css
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader"
          },
          { loader: "sass-loader" }
        ],
        exclude: /\.module\.scss$/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "../templates/index.html",
      template: "public/index.html"
    })
  ]
};
