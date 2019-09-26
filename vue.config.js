module.exports = {
  baseUrl: '',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://pdftexapi.pythonanywhere.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
  // eslint-disable-next-line eol-last
}