const path = require('path')

const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, '')
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
}
