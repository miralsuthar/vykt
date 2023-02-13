import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "ethereum-waffle";
import { parseEther } from "ethers/lib/utils";

const setup = async () => {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const prov = ethers.provider;

  const Vykt = await ethers.getContractFactory("Vykt");
  const vykt = await Vykt.deploy(ethers.utils.parseEther("1"));

  await vykt.deployed();
  return { owner, addr1, addr2, prov, vykt };
};

describe("Vykt", function () {
  describe("During Deployment", function () {
    it("Should return the price which is set during the deployment", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);
      expect(await vykt.getPrice()).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should return the owner which is set during the deployment", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);
      expect(await vykt.owner()).to.equal(owner.address);
    });
  });

  describe("Price related functions", function () {
    it("Should be able to change the price using the setPrice function if owner", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);
      await vykt.setPrice(ethers.utils.parseEther("0.5"));
      expect(await vykt.getPrice()).to.equal(ethers.utils.parseEther("0.5"));
    });

    it("Should not be able to change the price using the setPrice function if not the owner", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);
      await expect(
        vykt.connect(addr1).setPrice(ethers.utils.parseEther("2"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("ImageURI related functions", function () {
    it("Should not be able to change the imageURI for the msg.sender using setCurrentImageURI func if msg.value < price", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);

      const testURI = "https://www.google.com/";

      await expect(
        vykt.connect(owner).setCurrentImageURI(testURI, {
          value: ethers.utils.parseEther("0.1"),
        })
      ).to.be.revertedWith("Not enough BIT");
    });

    it("Should be able to change the imageURI for the msg.sender using setCurrentImageURI func if msg.value >= price", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);

      const testURI = "https://www.google.com/";

      await vykt.connect(owner).setCurrentImageURI(testURI, {
        value: ethers.utils.parseEther("1.5"),
      });

      expect(
        await vykt.connect(owner).getCurrentImageURI(owner.address)
      ).to.equal(testURI);
    });

    it("Should be able to retrieve the current imageURI for the msg.sender using getCurrentImageURI func", async function () {
      const { owner, addr1, vykt } = await loadFixture(setup);

      const testURI = "https://www.google.com/";

      await vykt.connect(owner).setCurrentImageURI(testURI, {
        value: ethers.utils.parseEther("1.5"),
      });

      expect(
        await vykt.connect(owner).getCurrentImageURI(owner.address)
      ).to.equal(testURI);
    });

    it("Should be able to retrieve the list of previous set ImageURIs for the msg.sender using getImageURIs func", async function () {
      const { owner, addr1, prov, vykt } = await loadFixture(setup);

      const testURI1 = "https://www.google.com/";
      const testURI2 = "https://www.youtube.com/";

      let balance = await ethers.provider.getBalance(vykt.address);

      await vykt.connect(addr1).setCurrentImageURI(testURI1, {
        value: ethers.utils.parseEther("1.5"),
      });

      expect(await ethers.provider.getBalance(vykt.address)).to.equal(
        balance.add(ethers.utils.parseEther("1.5"))
      );

      balance = await prov.getBalance(vykt.address);

      await vykt.connect(addr1).setCurrentImageURI(testURI2, {
        value: ethers.utils.parseEther("1.5"),
      });

      expect(await ethers.provider.getBalance(vykt.address)).to.equal(
        balance.add(ethers.utils.parseEther("1.5"))
      );

      expect(
        await vykt.connect(addr1).getImageURIs(addr1.address)
      ).to.deep.equal([testURI1, testURI2]);
    });
  });

  describe("Owner related functions", function () {
    it("Should be able to withdraw the funds using the withdraw function if owner", async function () {
      const { owner, addr1, prov, vykt } = await loadFixture(setup);

      const testURI = "https://www.google.com/";

      let ownerBalance = await prov.getBalance(owner.address);
      let contractBalance = await prov.getBalance(vykt.address);

      await vykt.connect(owner).setCurrentImageURI(testURI, {
        value: ethers.utils.parseEther("1.5"),
      });

      let ownerBalanceAfterSet = await prov.getBalance(owner.address);

      await vykt.connect(owner).withdraw(ethers.utils.parseEther("1.5"));

      expect(await prov.getBalance(vykt.address)).to.equal(contractBalance);
      expect((await prov.getBalance(owner.address)) > ownerBalanceAfterSet);
    });

    it("Should not be able to withdraw the funds using the withdraw function if not the owner", async function () {
      const { owner, addr1, prov, vykt } = await loadFixture(setup);

      await expect(
        vykt.connect(addr1).withdraw(ethers.utils.parseEther("1.5"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Emitted events", function () {
    it("Should emit an event when the price is changed", async function () {
      const { owner, addr1, prov, vykt } = await loadFixture(setup);

      await expect(vykt.connect(owner).setPrice(ethers.utils.parseEther("2")))
        .to.emit(vykt, "PriceChanged")
        .withArgs(ethers.utils.parseEther("2"));
    });

    it("Should emit an event when the imageURI is changed", async function () {
      const { owner, addr1, addr2, prov, vykt } = await loadFixture(setup);

      const testURI = "https://www.google.com/";

      await expect(
        vykt.connect(addr1).setCurrentImageURI(testURI, {
          value: ethers.utils.parseEther("2"),
        })
      )
        .to.emit(vykt, "ImageURIChanged")
        .withArgs(addr1.address, testURI);

      await expect(
        vykt.connect(addr2).setCurrentImageURI(testURI, {
          value: ethers.utils.parseEther("2"),
        })
      )
        .to.emit(vykt, "AllImageURIs")
        .withArgs(addr2.address, [testURI]);
    });
  });
});
