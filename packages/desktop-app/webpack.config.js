const path = require('path')

const preloadConfig = {
  mode  : 'production',
  entry : './src/preload.ts',
  output: {
    path    : path.resolve(__dirname, 'lib'),
    filename: 'preload.js',
  },
  target: 'electron-main',
  module: {
    rules: [
      {
        test   : /\.ts$/,
        use    : 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}

const appConfig = {
  mode  : 'production',
  entry : './src/app.tsx',
  output: {
    path    : path.resolve(__dirname, 'lib'),
    filename: 'app.js',
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test   : /\.tsx?$/,
        use    : 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use : [
          'style-loader',
          {
            loader : 'css-loader',
            options: {
              modules      : true,
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test   : /\.css$/i,
        use    : ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
}

module.exports = [appConfig, preloadConfig]
