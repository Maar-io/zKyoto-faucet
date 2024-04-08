export const RPC = "https://rpc.startale.com/zkyoto"
export const CONTRACT_ADDRESS = "0x5e0476898Ed089644C63A0dC53690a54a77F38fc"
export const CONTRACT_ABI = [
    "function drip(address) external",
    "function availableDrips() public view returns (uint256)",
    "function drain(address account) external",
    "function setDripAmounts(uint256 _dripAmount) external",
    "function setDripPeriod(uint256 _dripPeriod) external",
    "function nextDrip(address account) public view returns (uint256)"
  ];