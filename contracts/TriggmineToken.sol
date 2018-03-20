pragma solidity ^0.4.18;

import './libs/Ownable.sol';
import './token/StandardToken.sol';
import './token/BurnableToken.sol';

/**
 * @title TriggmineToken
 */
contract TriggmineToken is StandardToken, BurnableToken, Ownable {

	string public constant name = "Triggmine Coin";

	string public constant symbol = "TRG";

	uint256 public constant decimals = 18;

	bool public released = false;
	event Release();

	address public holder;

	mapping(address => uint) public lockedAddresses;

	modifier isReleased () {
		require(released || msg.sender == holder || msg.sender == owner);
		require(lockedAddresses[msg.sender] <= now);
		_;
	}

	function TriggmineToken() public {
		owner = 0x7E83f1F82Ab7dDE49F620D2546BfFB0539058414;

		totalSupply_ = 620000000 * (10 ** decimals);
		balances[owner] = totalSupply_;
		Transfer(0x0, owner, totalSupply_);

		holder = owner;
	}

	function lockAddress(address _lockedAddress, uint256 _time) public onlyOwner returns (bool) {
		require(balances[_lockedAddress] == 0 && lockedAddresses[_lockedAddress] == 0 && _time > now);
		lockedAddresses[_lockedAddress] = _time;
		return true;
	}

	function release() onlyOwner public returns (bool) {
		require(!released);
		released = true;
		Release();

		return true;
	}

	function getOwner() public view returns (address) {
		return owner;
	}

	function transfer(address _to, uint256 _value) public isReleased returns (bool) {
		return super.transfer(_to, _value);
	}

	function transferFrom(address _from, address _to, uint256 _value) public isReleased returns (bool) {
		return super.transferFrom(_from, _to, _value);
	}

	function approve(address _spender, uint256 _value) public isReleased returns (bool) {
		return super.approve(_spender, _value);
	}

	function increaseApproval(address _spender, uint _addedValue) public isReleased returns (bool success) {
		return super.increaseApproval(_spender, _addedValue);
	}

	function decreaseApproval(address _spender, uint _subtractedValue) public isReleased returns (bool success) {
		return super.decreaseApproval(_spender, _subtractedValue);
	}

	function transferOwnership(address newOwner) public onlyOwner {
		address oldOwner = owner;
		super.transferOwnership(newOwner);

		if (oldOwner != holder) {
			allowed[holder][oldOwner] = 0;
			Approval(holder, oldOwner, 0);
		}

		if (owner != holder) {
			allowed[holder][owner] = balances[holder];
			Approval(holder, owner, balances[holder]);
		}
	}

}
