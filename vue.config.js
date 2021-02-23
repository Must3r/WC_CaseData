module.exports = {
  devServer: {
    public: 'localhost',
    proxy: 'https://test3.job-server.net/',
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? './jobnet'
    : '/jobnet'
}