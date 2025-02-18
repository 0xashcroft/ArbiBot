const web3Provider = require('../utils/web3Provider');

// Uniswap V2 Router ABI (simplified)
const UNISWAP_V2_ROUTER_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "address[]", "name": "path", "type": "address[]"}
    ],
    "name": "getAmountsOut",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

class DexInteractions {
  constructor() {
    this.contracts = new Map();
    this.initializeContracts();
  }

  initializeContracts() {
    // Uniswap V2 Router on Ethereum
    const ethWeb3 = web3Provider.getProvider('ethereum');
    const uniswapRouter = new ethWeb3.eth.Contract(
      UNISWAP_V2_ROUTER_ABI,
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    );
    this.contracts.set('uniswap-ethereum', uniswapRouter);

    // PancakeSwap Router on BSC
    const bscWeb3 = web3Provider.getProvider('bsc');
    const pancakeRouter = new bscWeb3.eth.Contract(
      UNISWAP_V2_ROUTER_ABI,
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );
    this.contracts.set('pancakeswap-bsc', pancakeRouter);
  }

  async getPrice(exchange, network, tokenA, tokenB, amountIn) {
    const contractKey = `${exchange}-${network}`;
    const contract = this.contracts.get(contractKey);

    if (!contract) {
      throw new Error(`Contract for ${contractKey} not found`);
    }

    try {
      const path = [tokenA, tokenB];
      const amounts = await contract.methods.getAmountsOut(amountIn, path).call();
      return amounts[1];
    } catch (error) {
      console.error(`Error getting price from ${contractKey}:`, error.message);
      return null;
    }
  }

  async getUniswapPrice(tokenA, tokenB, amountIn) {
    return this.getPrice('uniswap', 'ethereum', tokenA, tokenB, amountIn);
  }

  async getPancakePrice(tokenA, tokenB, amountIn) {
    return this.getPrice('pancakeswap', 'bsc', tokenA, tokenB, amountIn);
  }
}

module.exports = new DexInteractions();