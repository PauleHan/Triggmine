var TriggmineToken = artifacts.require("TriggmineToken");

contract('TriggmineToken', function(accounts) {
	it("should be this total supply", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.totalSupply.call();
		}).then(function(totalSupplyOfTokens) {
			assert.equal(totalSupplyOfTokens.valueOf(), 620000000000000000000000000, "total supply of tokens wasn`t 620000000000000000000000000");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("balance of the first account should be correctly", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.balanceOf.call(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.valueOf(), 620000000000000000000000000, "620000000000000000000000000 wasn't in the first account");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transfer coin from owner before release", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 100000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transfer coin from someone(not owner or holder) before release (negative test)", function() {
		var meta;
		var account_one = accounts[1];
		var account_two = accounts[2];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 50000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should add lockedAddresses", function() {
		var lockedAddress1 = accounts[5];
		var blockedTime1 = 1520683200000;
		var lockedAddress2 = accounts[6];
		var date = Date.now();
		console.log(date);
		var blockedTime2 = date + 10;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.lockAddress(lockedAddress1, blockedTime1);
		}).then(function() {
			return meta.lockAddress(lockedAddress2, blockedTime2);
		}).then(function() {
			return meta.lockedAdrresses.call(lockedAddress1);
		}).then(function(time) {
			console.log(time);
			assert.equal(time, blockedTime1, "lockAddress failed");
			return meta.lockedAdrresses.call(lockedAddress2);
		}).then(function(time) {
			console.log(time);
			assert.equal(time, blockedTime2, "lockAddress failed");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should be released from notOwner (negative test)", function() {
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.release({from: accounts[3]});
		}).then(function() {
			return meta.released.call();
		}).then(function(released) {
			assert.equal(released, true, "token was released");
		}).catch(error => {
		console.log("uncorrect sender for doing release: ", error.message);
		});
	});
	it("should be released", function() {
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.release();
		}).then(function() {
			return meta.released.call();
		}).then(function(released) {
			assert.equal(released, true, "token was released");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transfer coin from someone", function() {
		var meta;
		var account_one = accounts[1];
		var account_two = accounts[4];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 60000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transfer coin(negative test)", function() {
		var meta;
		var account_one = accounts[6];
		var account_two = accounts[3];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 100000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log("uncorrect transfer: ", error.message);
		});
	});
	it("should transfer negative amount of coin (negative test)", function() {
		var meta;
		var account_one = accounts[4];
		var account_two = accounts[3];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = - 100000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log("uncorrect transfer: ", error.message);
		});
	});
	it("should give accounts[1] authority to spend account[0]'s token", function() {
		var meta;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.approve(accounts[1], 12500000000000000000000000);
		}).then(function(){
			return meta.allowance.call(accounts[0], accounts[1]);
		}).then(function(result){
			assert.equal(result.toNumber(), 12500000000000000000000000, 'allowance is wrong, bcs approve was failed.');
		});
	});
	it("should transferFrom tokens to accounts[2] from accounts[0]", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var account_three = accounts[2];
		var account_one_starting_balance;
		var account_two_starting_allowance;
		var account_three_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_allowance;
		var account_three_ending_balance;
		var amount = 7000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			account_two_starting_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_three);
		}).then(function(balance) {
			account_three_starting_balance = balance.toNumber();
			return meta.transferFrom(account_one, account_three, amount, {from: account_two});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			account_two_ending_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_three);
		}).then(function(balance) {
			account_three_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_allowance, account_two_starting_allowance - amount, "Amount wasn't correctly taken from allowance");
			assert.equal(account_three_ending_balance, account_three_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should increase approval for accounts[1]", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var starting_allowance;
		var ending_allowance;
		var amount = 2000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			starting_allowance = allowance.toNumber();			
			return meta.increaseApproval(account_two, amount, {from: account_one});
		}).then(function(){
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			ending_allowance = allowance.toNumber();
			assert.equal(ending_allowance, starting_allowance + amount, 'allowance is wrong, bcs increaseApproval was failed.');
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should increase approval on negative amount for account[1] (negative test)", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var starting_allowance;
		var ending_allowance;
		var amount = - 1000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			starting_allowance = allowance.toNumber();			
			return meta.increaseApproval(account_two, amount, {from: account_one});
		}).then(function(){
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			ending_allowance = allowance.toNumber();
			assert.equal(ending_allowance, starting_allowance, 'allowance is wrong.');
		}).catch(error => {
		console.log("uncrorrect increase:", error.message);
		});
	});
	it("should decrease approval for accounts[1]", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var starting_allowance;
		var ending_allowance;
		var amount = 1000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			starting_allowance = allowance.toNumber();			
			return meta.decreaseApproval(account_two, amount, {from: account_one});
		}).then(function(){
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			ending_allowance = allowance.toNumber();
			assert.equal(ending_allowance, starting_allowance - amount, 'allowance is wrong. Bcs decreaseApproval was failed.');
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should decrease all approval for accounts[1]", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var starting_allowance;
		var ending_allowance;
		var amount = - 1000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			starting_allowance = allowance.toNumber();			
			return meta.decreaseApproval(account_two, amount, {from: account_one});
		}).then(function(){
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			ending_allowance = allowance.toNumber();
			assert.equal(ending_allowance, 0, 'allowance is wrong.');
		}).catch(error => {
		console.log("uncrorrect decrease:", error.message);
		});
	});
	it("should transferOwnership from accounts[0] to accounts[1] incresed approval for accounts[1]", function() {
		var meta;
		var account_one = accounts[0];
		var account_two = accounts[1];
		var starting_allowance;
		var ending_allowance;
		var balance_account_one;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			starting_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			balance_account_one = balance.toNumber();
			return meta.transferOwnership(account_two, {from: account_one});
		}).then(function() {
			return meta.allowance.call(account_one, account_two);
		}).then(function(allowance) {
			ending_allowance = allowance.toNumber();
			return meta.owner.call();
		}).then(function(result){
			assert.equal(result, account_two, 'transferOwnership failed');
			assert.equal(ending_allowance, starting_allowance + balance_account_one, 'approve with transferOwnership failed.');
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transferOwnership from account[1] to account[2] (negative test)", function() {
		var meta;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.transferOwnership(accounts[2], {from: accounts[3]});
		}).then(function(){
			return meta.owner.call();
		}).then(function(result){
			assert.equal(result, accounts[2], 'account[2] is owner now');
		}).catch(error => {
		console.log("uncorrect transferOwnership: ", error.message);
		});
	});
	it("should transferFrom coin from newOwner to lockedAddress1", function() {
		var meta;
		var holder = accounts[0];
		var account_one = accounts[1];
		var account_two = accounts[5];
		var holder_starting_balance;
		var holder_ending_balance;
		var account_one_starting_allowance;
		var account_one_ending_allowance;
		var account_two_starting_balance;
		var account_two_ending_balance;
		var amount = 100000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(holder);
		}).then(function(balance) {
			holder_starting_balance = balance.toNumber();
			return meta.allowance.call(holder, account_one);
		}).then(function(allowance) {
			account_one_starting_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transferFrom(holder, account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(holder);
		}).then(function(balance) {
			holder_ending_balance = balance.toNumber();
			return meta.allowance.call(holder, account_one);
		}).then(function(allowance) {
			account_one_ending_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(holder_ending_balance, holder_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_one_ending_allowance, account_one_starting_allowance - amount, "Amount wasn't correctly taken from allowance");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("should transfer coin from lockedAddress1 before blockedTime end (negative test)", function() {
		var meta;
		var account_one = accounts[5];
		var account_two = accounts[3];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 60000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log("uncorrect transfer from lockedAddress:", error.message);
		});
	});
	it("should transferFrom coin from newOwner to lockedAddress2", function() {
		var meta;
		var holder = accounts[0];
		var account_one = accounts[1];
		var account_two = accounts[6];
		var holder_starting_balance;
		var holder_ending_balance;
		var account_one_starting_allowance;
		var account_one_ending_allowance;
		var account_two_starting_balance;
		var account_two_ending_balance;
		var amount = 40000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.balanceOf.call(holder);
		}).then(function(balance) {
			holder_starting_balance = balance.toNumber();
			return meta.allowance.call(holder, account_one);
		}).then(function(allowance) {
			account_one_starting_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transferFrom(holder, account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(holder);
		}).then(function(balance) {
			holder_ending_balance = balance.toNumber();
			return meta.allowance.call(holder, account_one);
		}).then(function(allowance) {
			account_one_ending_allowance = allowance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(holder_ending_balance, holder_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_one_ending_allowance, account_one_starting_allowance - amount, "Amount wasn't correctly taken from allowance");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log(error.message);
		});
	});
	it("balance of the lockedAddress2 should be correctly", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.balanceOf.call(accounts[6]);
		}).then(function(balance) {
			console.log(balance);
			assert.equal(balance.valueOf(), 40000000000000000000000000, "40000000000000000000000000 wasn't in the first account");
		}).catch(error => {
		console.log(error.message);
		});
	});	
	it("should transfer coin from lockedAddress2 after blockedTime end", function() {
		var meta;
		var account_one = accounts[6];
		var account_two = accounts[2];
		var account_one_starting_balance;
		var account_two_starting_balance;
		var account_one_ending_balance;
		var account_two_ending_balance;
		var amount = 1000000000000000000000000;
		return TriggmineToken.deployed().then(function(instance) {
			meta = instance;
			return meta.lockedAdrresses.call(account_one);
		}).then(function(time) {
			console.log(time);
			console.log(Date.now());
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_starting_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_starting_balance = balance.toNumber();
			return meta.transfer(account_two, amount, {from: account_one});
		}).then(function() {
			return meta.balanceOf.call(account_one);
		}).then(function(balance) {
			account_one_ending_balance = balance.toNumber();
			return meta.balanceOf.call(account_two);
		}).then(function(balance) {
			account_two_ending_balance = balance.toNumber();
			assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
			assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
		}).catch(error => {
		console.log("uncorrect transfer from lockedAddress:", error.message);
		});
	});
	it("balance of the lockedAddress2 should be correctly", function() {
		return TriggmineToken.deployed().then(function(instance) {
			return instance.balanceOf.call(accounts[6]);
		}).then(function(balance) {
			console.log(balance);
			assert.equal(balance.valueOf(), 3.9e+25, "3.9e+25 wasn't in the first account");
		}).catch(error => {
		console.log(error.message);
		});
	});
});