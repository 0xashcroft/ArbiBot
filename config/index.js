require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000
  },
  blockchain: {
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL,
      chainId: 1
    },
    bsc: {
      rpcUrl: process.env.BSC_RPC_URL,
      chainId: 56
    },
    polygon: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      chainId: 137
    }
  },
  trading: {
    minProfitPercentage: parseFloat(process.env.MIN_PROFIT_PERCENTAGE) || 1.5,
    maxGasPrice: parseInt(process.env.MAX_GAS_PRICE) || 50,
    slippageTolerance: parseFloat(process.env.SLIPPAGE_TOLERANCE) || 0.5,
    privateKey: process.env.PRIVATE_KEY
  },
  dex: {
    uniswap: {
      graphUrl: process.env.UNISWAP_GRAPH_URL
    },
    pancakeswap: {
      graphUrl: process.env.PANCAKE_GRAPH_URL
    }
  }
};