var TriggmineToken = artifacts.require("TriggmineToken");

module.exports = function(deployer) {
    return deployer.deploy(TriggmineToken).then(function() {
        console.log("Token address: " + TriggmineToken.address);
    });
};
