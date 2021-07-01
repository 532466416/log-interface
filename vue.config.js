module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.3.158:8088',
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}