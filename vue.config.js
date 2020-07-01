module.exports = {
    devServer: {
        proxy: {
          '/json': {
            target: 'http://localhost:8100/',
            // changeOrigin: true,
            ws: true,
            pathRewrite: {
              '^/json': ''
            }
          }
        }
    }
};