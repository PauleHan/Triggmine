var TriggmineToken = artifacts.require("TriggmineToken");
var TriggmineCrowdSale = artifacts.require("TriggmineCrowdSale");

var tokenAddress;
var crowdsaleAddress;

contract('Connect', function(accounts) {
	tokenAddress = TriggmineToken.address;
	crowdsaleAddress = TriggmineCrowdSale.address;

	it("should confirm the Token address", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return instance.token.call();
		}).then(function(address) {
			assert.equal(address, tokenAddress, "Token account is the same");
		});
	});
});

contract('TriggmineCrowdSale', function(accounts) {
	tokenAddress = TriggmineToken.address;
	crowdsaleAddress = TriggmineCrowdSale.address;
	var ethReceiver;
	it("should change wallet", function() {
		var meta;
		return TriggmineCrowdSale.deployed().then(function(instance) {
			meta = instance;
			return meta.vault.call();
		}).then(function(address) {
			ethReceiver = address;
		});
	});
	it("should transferOwnership from account[0] to TriggmineCrowdSale", function() {
		var meta;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.transferOwnership(crowdsaleAddress, {from: accounts[0]});
		}).then(function(){
			return meta.owner.call();
		}).then(function(result) {
			assert.equal(result, crowdsaleAddress, 'crowdsaleAddress is owner now');
		});
	});
	it("should set PreSale data", function() {
		var meta;
		return TriggmineCrowdSale.deployed().then(function(instance) {
			meta = instance
			return meta.setPreSaleFirstTwoDaysMileStone(1519729200,1519905600);
		}).then(function() {
			return meta.setPreSaleThirdDayMileStone(1519905600,1519992000);
		}).then(function() {
			return meta.setPreSaleFourthDayMileStone(1519992000,1520078400);
		}).then(function() {
			return meta.setPreSaleFifthDayMileStone(1520078400,1520164800);
		}).then(function() {
			return meta.setPreSaleSixthDayMileStone(1520164800,1520251200);
		}).then(function() {
			return meta.setPreSaleLastDaysMileStone(1520251200,1520337600);
		}).catch(error => {
		console.log(error.message)
		});
	});
	it("should set MainSale data", function() {
		var meta;
		return TriggmineCrowdSale.deployed().then(function(instance) {
			meta = instance
			return meta.setMainSaleFirstThreeDaysMileStone(1520424000,1520683200);
		}).then(function() {
			return meta.setMainSaleFourthSeventhDaysMileStone(1520683200,1521028800);
		}).then(function() {
			return meta.setMainSaleLastDaysMileStone(1521028800,1521201600);
		}).catch(error => {
		console.log(error.message)
		});
	});
	it("should correctry getCurrentMilestone", function() {
		var meta;
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return instance.getCurrentMileStone();
		}).then(function(milestone) {
			assert.equal(milestone.c, 2, "Wrong milestone");
		}).catch(error => {
		console.log(error.message)
		});
	});
	it("should buy some Tokens", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return instance.buyTokens(accounts[0], {from: accounts[0], value: web3.toWei(1, "ether")});
		}).then(function(tx) {
			assert.equal(tx.logs[0].event, "TokenPurchase", "Wrong operation");
		}); 
	});
	it("should buy some Tokens uncorrectly (negative test)", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return instance.buyTokens(accounts[1], {from: accounts[1], value: web3.toWei(0, "ether")});
		}).then(function(tx) {
			assert.equal(tx.logs[0].event, "TokenPurchase", "Wrong operation");
		}).catch(error => {
		console.log(error.message)
		});
	});
	it("should have TOKENs on accounts[0]", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.balanceOf.call(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.valueOf(), 12000000000000000000000, "Purchaser has the new Tokens");
		});
	});
	it("should TriggmineCrowdSale received the Ether", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return web3.eth.getBalance(ethReceiver);
		}).then(function(balance) {
			assert.equal(balance.valueOf(), web3.toWei(1, "ether"), "Nope");
		});
	});
	/*it("should buy some Tokens", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return instance.buyTokens(accounts[2], {from: accounts[2], value: web3.toWei(2, "ether")});
		}).then(function(tx) {
			assert.equal(tx.logs[0].event, "TokenPurchase", "Wrong operation");
		}); 
	});
	it("should have TOKENs on accounts[2]", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.balanceOf.call(accounts[2]);
		}).then(function(balance) {
			assert.equal(balance.valueOf(), 24000000000000000000000, "Purchaser has the new Tokens");
		});
	});
	it("should TriggmineCrowdSale received the Ether", function() {
		return TriggmineCrowdSale.deployed().then(function(instance) {
			return web3.eth.getBalance(ethReceiver);
		}).then(function(balance) {
			assert.equal(balance.valueOf(), web3.toWei(3, "ether"), "Nope");
		});
	});*/
});

