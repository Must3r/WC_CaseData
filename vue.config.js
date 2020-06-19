module.exports = {
  devServer: {
    public: 'localhost',
    proxy: 'https://job-server.net/',
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/'
}