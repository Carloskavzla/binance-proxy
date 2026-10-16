const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', createProxyMiddleware({
  target: 'https://api.binance.com',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers['x-mbx-apikey']) {
        proxyReq.setHeader('X-MBX-APIKEY', req.headers['x-mbx-apikey']);
      }
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy listo en puerto ${PORT}`);
});
