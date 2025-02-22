const express = require('express');
const cors = require('cors');
require('dotenv').config();

const arbitrageEngine = require('./services/arbitrageEngine');
const priceMonitor = require('./services/priceMonitor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ message: 'ArbiBot API is running!' });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/opportunities', (req, res) => {
  const opportunities = arbitrageEngine.getOpportunities();
  res.json(opportunities);
});

app.get('/api/stats', (req, res) => {
  const stats = arbitrageEngine.getStats();
  res.json(stats);
});

app.post('/api/start', (req, res) => {
  arbitrageEngine.start();
  priceMonitor.start();
  res.json({ message: 'Bot started successfully' });
});

app.post('/api/stop', (req, res) => {
  arbitrageEngine.stop();
  priceMonitor.stop();
  res.json({ message: 'Bot stopped successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});