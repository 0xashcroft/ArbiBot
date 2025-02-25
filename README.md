# ArbiBot

A multi-chain arbitrage trading bot that monitors price differences across DEXes and automatically identifies profitable trading opportunities.

## Features

- Multi-chain support (Ethereum, BSC, Polygon)
- Real-time price monitoring from Uniswap and PancakeSwap
- Automated arbitrage opportunity detection
- Web-based dashboard for monitoring
- RESTful API for programmatic access

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your RPC URLs and API keys
```

3. Start the bot:
```bash
npm start
```

4. Open the dashboard:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/status` - Bot status
- `GET /api/opportunities` - Recent opportunities
- `GET /api/stats` - Trading statistics
- `POST /api/start` - Start monitoring
- `POST /api/stop` - Stop monitoring

## Configuration

Edit the `.env` file to configure:

- RPC endpoints for each blockchain
- Private keys for trading (if automated execution is enabled)
- Minimum profit thresholds
- Gas price limits
- Slippage tolerance

## Architecture

- `server.js` - Main Express server
- `services/arbitrageEngine.js` - Core arbitrage detection logic
- `services/priceMonitor.js` - Price monitoring service
- `contracts/dexInteractions.js` - DEX contract interactions
- `utils/web3Provider.js` - Blockchain connection utilities
- `config/index.js` - Configuration management
- `public/` - Web dashboard

## Disclaimer

This is for educational purposes only. Trading cryptocurrencies involves significant risk. Use at your own risk.