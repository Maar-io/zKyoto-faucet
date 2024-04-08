export const RPC = "https://rpc.startale.com/zkyoto"
export const CONTRACT_ADDRESS = "0xE19bBaA341894EE5D5190019Cf6D0Cc23b9D659A"
export const CONTRACT_ABI = [
    "function drip(address) external",
    "function availableDrips() public view returns (uint256)",
    "function drain(address account) external",
    "function setDripAmounts(uint256 _dripAmount) external",
    "function setDripPeriod(uint256 _dripPeriod) external",
    "function nextDrip(address account) public view returns (uint256)"
  ];