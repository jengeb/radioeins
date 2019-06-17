const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  cache: false,
  entry: {
    index: ['./src/styles/index.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    // used by the MiniCssExtractPlugin
    minimizer: [new OptimizeCSSAssetsPlugin()]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader", // translates CSS into CommonJS
        "postcss-loader", // used for autoprefixer
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    }]
  }
}
