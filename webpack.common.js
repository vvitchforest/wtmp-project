const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WriteFilePlugin(),
    new CopyPlugin({
      patterns: [
      {
        from: 'assets/',
        to: 'assets/',
        context: 'src/',
      },
    ]}),
    new HtmlWebpackPlugin({
      title: 'WTMP Project',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0'
      },
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      //maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
    }),
    new WebpackPwaManifest({
      name: 'Metropolia Info Karaportti progressive web app',
      short_name: 'MetropoliaInfo',
      description: 'Metropolia Info Karaportti is an app which displays information about Karaportti campus, including lunch menus and transport.',
      background_color: '#ffffff',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512]
        },
      ]
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          // eslint options (check .eslintrc.json too)
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|webp|ttf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
