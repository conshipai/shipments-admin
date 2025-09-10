devServer: {
  port: 3002,
  host: '0.0.0.0',
  historyApiFallback: true,
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    // Important for Module Federation
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
  },
  hot: true,
  client: {
    webSocketURL: 'auto://0.0.0.0:0/ws'
  }
}
