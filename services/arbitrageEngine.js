const dexInteractions = require('../contracts/dexInteractions');
const config = require('../config');

class ArbitrageEngine {
  constructor() {
    this.opportunities = [];
    this.isRunning = false;
    this.commonTokens = {
      ethereum: {
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        USDC: '0xA0b86a33E6421c8f4CE9c45d9AE6E8D3B6c4C8c2',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      },
      bsc: {
        WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        USDT: '0x55d398326f99059fF775485246999027B3197955'
      }
    };
  }

  start() {
    console.log('Starting arbitrage engine...');
    this.isRunning = true;
    this.scanForOpportunities();
  }

  stop() {
    console.log('Stopping arbitrage engine...');
    this.isRunning = false;
  }

  async scanForOpportunities() {
    while (this.isRunning) {
      try {
        await this.checkCrossChainArbitrage();
        await this.delay(15000); // 15 seconds between scans
      } catch (error) {
        console.error('Error scanning for opportunities:', error.message);
        await this.delay(5000);
      }
    }
  }

  async checkCrossChainArbitrage() {
    const amount = '1000000000000000000'; // 1 ETH/BNB

    // Check WETH/USDC on Uniswap vs WBNB/BUSD on PancakeSwap
    try {
      const ethPrice = await dexInteractions.getUniswapPrice(
        this.commonTokens.ethereum.WETH,
        this.commonTokens.ethereum.USDC,
        amount
      );

      const bnbPrice = await dexInteractions.getPancakePrice(
        this.commonTokens.bsc.WBNB,
        this.commonTokens.bsc.BUSD,
        amount
      );

      if (ethPrice && bnbPrice) {
        const priceDiff = Math.abs(ethPrice - bnbPrice);
        const avgPrice = (ethPrice + bnbPrice) / 2;
        const profitPercent = (priceDiff / avgPrice) * 100;

        if (profitPercent > config.trading.minProfitPercentage) {
          const opportunity = {
            id: Date.now(),
            type: 'cross-chain',
            tokenPair: 'ETH/USDC vs BNB/BUSD',
            ethPrice: ethPrice,
            bnbPrice: bnbPrice,
            profitPercent: profitPercent.toFixed(2),
            timestamp: new Date().toISOString()
          };

          this.opportunities.push(opportunity);
          console.log(`Found arbitrage opportunity: ${profitPercent.toFixed(2)}% profit`);

          // Keep only last 100 opportunities
          if (this.opportunities.length > 100) {
            this.opportunities = this.opportunities.slice(-100);
          }
        }
      }
    } catch (error) {
      console.error('Error checking cross-chain arbitrage:', error.message);
    }
  }

  getOpportunities() {
    return this.opportunities.slice(-20); // Return last 20 opportunities
  }

  getStats() {
    const total = this.opportunities.length;
    const profitable = this.opportunities.filter(op =>
      parseFloat(op.profitPercent) > config.trading.minProfitPercentage
    ).length;

    return {
      totalOpportunities: total,
      profitableOpportunities: profitable,
      isRunning: this.isRunning,
      lastScan: new Date().toISOString()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new ArbitrageEngine();