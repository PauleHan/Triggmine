pragma solidity ^0.4.18;

import '../libs/Ownable.sol';
import '../TriggmineToken.sol';

contract TriggminePresale is Ownable {
    uint public constant SALES_START = 1523890800; // Monday, April 16, 2018 6:00:00 PM GMT+03:00
    uint public constant SALES_END = 1525100400; // Monday, April 30, 2018 6:00:00 PM GMT+03:00

    address public constant ASSET_MANAGER_WALLET = 0x7E83f1F82Ab7dDE49F620D2546BfFB0539058414;
    address public constant ESCROW_WALLET = 0x2e9F22E2D559d9a5ce234AB722bc6e818FA5D079;

    address public constant TOKEN_ADDRESS = 0x98F319D4dc58315796Ec8F06274fe2d4a5A69721; // Triggmine coin ERC20 contract address
    uint public constant TOKEN_CENTS = 1000000000000000000; // 1 TRG is 1^18
    uint public constant TOKEN_PRICE = 0.0001 ether;

    uint public constant ETH_HARD_CAP = 3000 ether;
    uint public constant SALE_MAX_CAP = 36000000 * TOKEN_CENTS;

    uint public constant BONUS_WL = 20;
    uint public constant BONUS_2_DAYS = 20;
    uint public constant BONUS_3_DAYS = 19;
    uint public constant BONUS_4_DAYS = 18;
    uint public constant BONUS_5_DAYS = 17;
    uint public constant BONUS_6_DAYS = 16;
    uint public constant BONUS_15_DAYS = 15;

    uint public saleContributions;
    uint public tokensPurchased;

    address public whitelistSupplier;
    mapping(address => bool) public whitelistPrivate;
    mapping(address => bool) public whitelistPublic;

    event Contributed(address receiver, uint contribution, uint reward);
    event PrivateWhitelistUpdated(address participant, bool isWhitelisted);
    event PublicWhitelistUpdated(address participant, bool isWhitelisted);

    function TriggminePresale() public {
        whitelistSupplier = msg.sender;
        owner = ASSET_MANAGER_WALLET;
    }

    modifier onlyWhitelistSupplier() {
        require(msg.sender == whitelistSupplier || msg.sender == owner);
        _;
    }

    function contribute() public payable returns(bool) {
        return contributeFor(msg.sender);
    }

    function contributeFor(address _participant) public payable returns(bool) {
        require(now < SALES_END);
        require(saleContributions < ETH_HARD_CAP);

        uint bonusPercents = 0;
        if (now < SALES_START) { // Only addresses from private WL can participate
            require(whitelistPrivate[_participant]);
            bonusPercents = BONUS_WL;
        } else if (now < SALES_START + 1 days) { // Only addresses from public & private WL can participate
            require(whitelistPublic[_participant] || whitelistPrivate[_participant]);
            bonusPercents = BONUS_WL;
        } else if (now < SALES_START + 2 days) {
            bonusPercents = BONUS_2_DAYS;
        } else if (now < SALES_START + 3 days) {
            bonusPercents = BONUS_3_DAYS;
        } else if (now < SALES_START + 4 days) {
            bonusPercents = BONUS_4_DAYS;
        } else if (now < SALES_START + 5 days) {
            bonusPercents = BONUS_5_DAYS;
        } else if (now < SALES_START + 6 days) {
            bonusPercents = BONUS_6_DAYS;
        } else if (now < SALES_START + 15 days) {
            bonusPercents = BONUS_15_DAYS;
        }

        // If there is some division reminder, we just collect it too.
        uint tokensAmount = (msg.value * TOKEN_CENTS) / TOKEN_PRICE;
        require(tokensAmount > 0);
        uint bonusTokens = (tokensAmount * bonusPercents) / 100;
        uint totalTokens = tokensAmount + bonusTokens;

        tokensPurchased += totalTokens;
        require(tokensPurchased <= SALE_MAX_CAP);
        require(TriggmineToken(TOKEN_ADDRESS).transferFrom(ASSET_MANAGER_WALLET, _participant, totalTokens));
        saleContributions += msg.value;
        //participantContribution[_participant] += msg.value;
        ESCROW_WALLET.transfer(msg.value);

        Contributed(_participant, msg.value, totalTokens);
        return true;
    }

    function addToPrivateWhitelist(address _participant) onlyWhitelistSupplier() public returns(bool) {
        if (whitelistPrivate[_participant]) {
            return true;
        }
        whitelistPrivate[_participant] = true;
        PrivateWhitelistUpdated(_participant, true);
        return true;
    }

    function removeFromPrivateWhitelist(address _participant) onlyWhitelistSupplier() public returns(bool) {
        if (!whitelistPrivate[_participant]) {
            return true;
        }
        whitelistPrivate[_participant] = false;
        PrivateWhitelistUpdated(_participant, false);
        return true;
    }

    function addToPublicWhitelist(address _participant) onlyWhitelistSupplier() public returns(bool) {
        if (whitelistPublic[_participant]) {
            return true;
        }
        whitelistPublic[_participant] = true;
        PublicWhitelistUpdated(_participant, true);
        return true;
    }

    function removeFromPublicWhitelist(address _participant) onlyWhitelistSupplier() public returns(bool) {
        if (!whitelistPublic[_participant]) {
            return true;
        }
        whitelistPublic[_participant] = false;
        PublicWhitelistUpdated(_participant, false);
        return true;
    }

    function getTokenOwner() public view returns (address) {
        return TriggmineToken(TOKEN_ADDRESS).getOwner();
    }

    function restoreTokenOwnership() public onlyOwner {
        TriggmineToken(TOKEN_ADDRESS).transferOwnership(ASSET_MANAGER_WALLET);
    }

    function () public payable {
        contribute();
    }

}
