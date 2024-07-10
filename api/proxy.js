// api/proxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'https://globalapi.solarmanpv.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/',
  },
});
