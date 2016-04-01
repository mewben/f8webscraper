var path = require('path');
var webpack = require('webpack');

module.exports = {
  debug: false,
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      config: path.join(__dirname, 'env', 'production')
    }
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      exclude: /(node_modules|bower_components)/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};
