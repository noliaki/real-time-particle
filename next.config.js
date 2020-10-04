const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV !== 'development'

const terserConfig = new TerserPlugin({
  terserOptions: {
    compress: {
      drop_console: process.env.NODE_ENV !== 'development'
    }
  }
})

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

    if(isServer) {
      return config
    }

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

      if(config.optimization.minimizer.length > 0) {
        config.optimization.minimizer.push(terserConfig)
      } else {
        config.optimization.minimizer = [
          terserConfig
        ]
      }
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
