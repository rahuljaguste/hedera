/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  it("Should return balance of owner", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    expect(await token.balanceOf(token.address)).to.eq(0);

    const owner = await token.owner();

    expect(await token.balanceOf(owner)).to.eq(1000000);
  });

  it("Should transfer tokens", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    const [owner, addr1] = await ethers.getSigners();
    const transferTx = await token
      .connect(owner)
      .transfer(addr1.address, 100000);

    await transferTx.wait();
    expect(await token.balanceOf(owner.address)).to.eq(1000000 - 100000);
    expect(await token.balanceOf(addr1.address)).to.eq(100000);

    // console.log(accounts[0].address, accounts[1].address);
  });

  it("Should not transfer tokens", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();

    const [owner, addr1] = await ethers.getSigners();
    expect(
      token.connect(owner).transfer(addr1.address, 1000000 + 10000)
    ).to.be.revertedWith("Not enough tokens");
  });
});
