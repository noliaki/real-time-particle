const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV !== 'development'

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(vert|glsl)/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    })

    if (!config.optimization) {
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
    } else {
      config.optimization.minimize = isProd
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV !== 'development'
            }
          }
        })
      ]
    }

    // config.optimization.minimize = isProd
    // config.optimization.minimizer.push(new TerserPlugin({
    //   terserOptions: {
    //     compress: {
    //       drop_console: process.env.NODE_ENV !== 'development'
    //     }
    //   }
    // }))

    return config
  },
}
