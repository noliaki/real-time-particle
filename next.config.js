const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV !== 'development'

module.exports = {
  webpack: (config, {isServer, dev}) => {
    config.module.rules.push({
      test: /\.(vert|glsl)/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    })

    return config
  },
}
