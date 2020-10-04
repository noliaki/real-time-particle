const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV !== 'development'

module.exports = {
  webpack: (config, {isServer}) => {
    config.module.rules.push({
      test: /\.(vert|glsl)/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    })

    if(!isServer) {
      config.optimization = {
        minimize: isProd,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: process.env.NODE_ENV !== 'development'
              }
            }
          })
        ]
      }
    }

    return config
  },
}
