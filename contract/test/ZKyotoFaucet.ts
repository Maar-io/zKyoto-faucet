import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

const DRIP_PERIOD_SECONDS = 86400;

describe("ZKyotoFaucet", function () {
  async function deployZKyotoFaucetFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();

    const ZKyotoFaucet = await hre.ethers.getContractFactory("ZKyotoFaucet");
    const zKyotoFaucet = await ZKyotoFaucet.deploy();

    // Send some ETH to the contract
    await owner.sendTransaction({
      to: zKyotoFaucet.target,
      value: ethers.parseEther("1.0"),
    });

    return { zKyotoFaucet, owner, addr1 };
  }

  it("Should return the correct amount of available drips", async function () {
    const { zKyotoFaucet } = await loadFixture(deployZKyotoFaucetFixture);

    // Call availableDrips
    const availableDrips = await zKyotoFaucet.availableDrips();
    console.log("availableDrips", availableDrips);

    // Check that the availableDrips is correct
    expect(availableDrips).to.be.gt(0);
  });

  describe("drip", function () {
    it("Should drip ETH to the sender", async function () {
      const { zKyotoFaucet, owner, addr1 } = await loadFixture(deployZKyotoFaucetFixture);

      // Connect to the contract with addr1 and call drip
      const tx = await zKyotoFaucet.connect(addr1).drip(addr1.address);


      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // // Check that the Drip event was emitted
      // const DripEvent = receipt?.events?.find((event) => event.event === "Drip");
      // expect(DripEvent).to.not.be.undefined;

      // // Check that the event parameters are correct
      // expect(DripEvent?.args?.account).to.equal(addr1.address);

      // Check that the balance of addr1 has increased
      expect(await hre.ethers.provider.getBalance(addr1.address)).to.be.gt(0);
    });
  });


  it("Should not allow to drip if the last drip was less than DRIP_PERIOD_SECONDS ago", async function () {
    const { zKyotoFaucet, owner, addr1 } = await loadFixture(deployZKyotoFaucetFixture);

    // Connect to the contract with addr1 and call drip
    await zKyotoFaucet.connect(addr1).drip(addr1.address);

    // Try to drip again immediately
    await expect(zKyotoFaucet.connect(addr1).drip(addr1.address)).to.be.revertedWith("Already claimed in the last 24hours");
  });

  describe("nextDrip", function () {
    it("Should not allow drip until time expires", async function () {
      const { zKyotoFaucet, addr1 } = await loadFixture(deployZKyotoFaucetFixture);

      // Connect to the contract with addr1 and call nextDrip
      const firstDripTime = await zKyotoFaucet.connect(addr1).nextDrip(addr1.address);
      expect(firstDripTime).to.equal(0);

      // Call drip
      await zKyotoFaucet.connect(addr1).drip(addr1.address);
      const afterDripTime = await zKyotoFaucet.connect(addr1).nextDrip(addr1.address);

      // Should fail if we try to drip before time expires
      await time.increase(3600);
      const nextDripTime = await zKyotoFaucet.connect(addr1).nextDrip(addr1.address);
      expect(nextDripTime).to.equal(DRIP_PERIOD_SECONDS-3600);
      await expect(zKyotoFaucet.connect(addr1).drip(addr1.address)).to.be.revertedWith("Already claimed in the last 24hours");

      // Should allow to drip after time expires
      await time.increase(DRIP_PERIOD_SECONDS);
      const nextDripTime2 = await zKyotoFaucet.connect(addr1).nextDrip(addr1.address);
      console.log("nextDripTime2", nextDripTime2);
      await zKyotoFaucet.connect(addr1).drip(addr1.address);
    });
  });
});