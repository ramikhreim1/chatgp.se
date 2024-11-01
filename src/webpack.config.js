// webpack.config.js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: '@pmmmwh/react-refresh-webpack-plugin/loader',
                },
                {
                    loader: 'babel-loader',
                    options: {
                        // Babel configuration options
                    },
                },
            ],
        },
    ],
  }
