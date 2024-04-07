// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

/// Drips ETH on zKyoto (Astar zkEVM testnet)
contract ZKyotoFaucet is Ownable {
    uint256 public DRIP_AMOUNT = 5e16;
    uint256 public DRIP_PERIOD_SECONDS = 86400;
    mapping(address => uint256) public claims;

    /// Events
    event FaucetDripped(address indexed recipient);
    event FaucetDrained(address indexed recipient);

    constructor() Ownable(msg.sender) {}

    /// @notice Drips ETH to msg sender
    function drip() external {
        address recipient = msg.sender;
        require(
            canGetDrip(claims[recipient]),
            "Already claimed in the last 24hours"
        );
        // Drip Ether
        (bool sent, ) = recipient.call{value: DRIP_AMOUNT}("");
        require(sent, "Failed dripping ETH");

        claims[recipient] = block.timestamp;

        emit FaucetDripped(recipient);
    }

    /// @notice Returns number of available drips
    function availableDrips() public view returns (uint256 drips) {
        drips = address(this).balance / DRIP_AMOUNT;
        return drips;
    }

    /// @notice Allows owner to drain contract
    function drain(address account) external onlyOwner {
        // Drain all Ether
        (bool sent, ) = account.call{value: address(this).balance}("");
        require(sent, "Failed draining Faucet");

        emit FaucetDrained(account);
    }

    /// @notice Set drip amounts
    function setDripAmounts(uint256 _dripAmount) external onlyOwner {
        DRIP_AMOUNT = _dripAmount;
    }

    /// @notice Set drip period
    function setDripPeriod(uint256 _dripPeriod) external onlyOwner {
        DRIP_PERIOD_SECONDS = _dripPeriod;
    }

    /// @notice Returns true if a account can receive drip
    function canGetDrip(uint256 lastClaim) internal view returns (bool) {
        return (block.timestamp - lastClaim > DRIP_PERIOD_SECONDS);
    }

    /// @notice Returns true if a account can drip
    function nextDrip(address account) public view returns (uint256) {
        if (block.timestamp - claims[account] >= DRIP_PERIOD_SECONDS) {
            return block.timestamp - claims[account];
        }
        return 0;
    }

    /// @notice Allows receiving ETH
    receive() external payable {
        // This function is executed when a contract receives plain Ether (without data)
    }
}
