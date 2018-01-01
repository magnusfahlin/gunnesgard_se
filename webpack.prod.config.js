const path = require("path");
const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: ["./client/src/index.js"],
  output: {
    path: path.join(__dirname, "build/client"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      filename: "index.html",
      inject: "body"
    })
  ],
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: "babel-loader",
        include: path.join(__dirname, "client/src"),
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/
      },
    //   {
    //     test: /\.(jpe?g|png|gif|svg)$/i,
    //     loaders: [
    //       "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
    //       "image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false"
    //     ]
    //   },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: "file-loader?name=[name].[ext]" // <-- retain original file name
      }
    ]
  }
};
