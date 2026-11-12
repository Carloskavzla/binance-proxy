const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const BINANCE_API = 'TyMNYiCxfPpM9Yr1PwWsrXOhPCuJVQaBGuL43QkKHdexijZNRompEDCodbytSf6lK';

app.use(express.json());

// Endpoint de prueba de salud / ping
app.get('/', (req, res) => {
  res.status(200).send('Binance Proxy Activo');
});

// Captura todas las rutas (/sapi/*, /api/*, etc.)
app.all('*', async (req, res) => {
  try {
    const targetUrl = BINANCE_API + req.originalUrl;
    
    // Extraer cabeceras relevantes
    const headers = {};
    if (req.headers['x-mbx-apikey']) {
      headers['X-MBX-APIKEY'] = req.headers['x-mbx-apikey'];
    }
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    const options = {
      method: req.method,
      headers: headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const binanceResponse = await fetch(targetUrl, options);
    const data = await binanceResponse.text();

    res.status(binanceResponse.status);
    
    // Devolver el contenido con su tipo original
    const contentType = binanceResponse.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);

    res.send(data);
  } catch (error) {
    console.error('Error en proxy:', error.message);
    res.status(500).json({ error: 'Proxy Gateway Error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy corriendo en puerto ${PORT}`);
});
