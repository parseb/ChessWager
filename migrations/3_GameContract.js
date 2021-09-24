var GameContract = artifacts.require("./GameContract.sol");

module.exports = function(deployer) {
  deployer.deploy(GameContract);
};
