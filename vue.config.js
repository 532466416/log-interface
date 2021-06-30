module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.92:8081/logs',
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}