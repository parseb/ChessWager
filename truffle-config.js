const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "^0.7",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  networks: {
    develop: {
      host: "localhost",
      port: 7546,
      //network_id: 1337,
      network_id: "*"
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com/`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mumbai: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://polygon-mumbai.infura.io/v3/a707aad70b7c485ab184a3e9d4e55964")},
        network_id: 80001,
        
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "wss://kovan.infura.io/ws/v3/a707aad70b7c485ab184a3e9d4e55964");
      },
      network_id: 42
    },
  },
  plugins: ["solidity-coverage",  "truffle-plugin-debugger"]
};
