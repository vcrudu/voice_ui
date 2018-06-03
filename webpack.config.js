var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var extractSass = new ExtractTextPlugin({
  filename: "main.css",
  disable: process.env.NODE_ENV === "development"
});
var path = require('path')
var glob = require('glob')
var BUILD_DIR = path.resolve(__dirname+'/www')
var WWW_DIR = path.resolve(__dirname+'/www')
var APP_DIR = path.resolve(__dirname+'/app')

var config = {
  entry: {
    index:APP_DIR + '/index.js',
    audio:APP_DIR + '/lex/audio.worker.js'
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js',
    publicPath: ''
  },
  devtool: 'source-map',
  devServer: {
    contentBase: BUILD_DIR,
    //hot: true,
    port: 3333
  },
  module:{
    rules: [
      /* {
        test: /\.js$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/
      }, */
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: [
          {
            loader:'babel-loader',
            options:{
              presets: ['env', 'react'],
              plugins: ['transform-object-rest-spread']
            }  
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader",
            options: {
              includePaths: ['node_modules', 'node_modules/@material/*']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          }  
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Blood pressure',
      template: APP_DIR + '/assets/index.html',
      filename:'index.html'
    }),
    extractSass//,
    //new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config;
