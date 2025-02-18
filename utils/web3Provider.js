const Web3 = require('web3');
const config = require('../config');

class Web3Provider {
  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  initializeProviders() {
    // Ethereum
    if (config.blockchain.ethereum.rpcUrl) {
      this.providers.set('ethereum', new Web3(config.blockchain.ethereum.rpcUrl));
    }

    // BSC
    if (config.blockchain.bsc.rpcUrl) {
      this.providers.set('bsc', new Web3(config.blockchain.bsc.rpcUrl));
    }

    // Polygon
    if (config.blockchain.polygon.rpcUrl) {
      this.providers.set('polygon', new Web3(config.blockchain.polygon.rpcUrl));
    }
  }

  getProvider(network) {
    const provider = this.providers.get(network);
    if (!provider) {
      throw new Error(`Provider for network ${network} not found`);
    }
    return provider;
  }

  async getBalance(network, address) {
    const web3 = this.getProvider(network);
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  }

  async getGasPrice(network) {
    const web3 = this.getProvider(network);
    return await web3.eth.getGasPrice();
  }

  async estimateGas(network, transaction) {
    const web3 = this.getProvider(network);
    return await web3.eth.estimateGas(transaction);
  }
}

module.exports = new Web3Provider();