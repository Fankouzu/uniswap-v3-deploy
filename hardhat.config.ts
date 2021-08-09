import "hardhat-typechain";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import { keccak256 } from "@ethersproject/solidity";
import { task } from "hardhat/config";
import dotenv from "dotenv";
const defaultAccount = 0;
import {
  allowVerifyChain,
  compileSetting,
  deployContract,
  getContract,
  mainTokenName,
} from "./script/deployTool";
import { RPCS } from "./script/network";
dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
  const accounts = await bre.ethers.getSigners();

  for (const account of accounts) {
    let address = await account.getAddress();
    console.log(
      address,
      (await bre.ethers.provider.getBalance(address)).toString()
    );
  }
});

task("getHash", "Get INIT_CODE_HASH").setAction(
  async ({}, { ethers, run, network }) => {
    await run("compile");
    const signer = (await ethers.getSigners())[defaultAccount];
    const v2factory = await ethers.getContractFactory("UniswapV2Factory");
    const v2pair = await ethers.getContractFactory("UniswapV2Pair");
    const v3factory = await ethers.getContractFactory("UniswapV3Factory");
    const v3pool = await ethers.getContractFactory("UniswapV3Pool");

    const v2bytecode = v2pair.bytecode;
    const v3bytecode = v3pool.bytecode;

    const COMPUTED_V2_INIT_CODE_HASH = keccak256(["bytes"], [v2bytecode]);
    const COMPUTED_V3_INIT_CODE_HASH = keccak256(["bytes"], [v3bytecode]);

    console.log("COMPUTED_V2_INIT_CODE_PAIR_HASH:", COMPUTED_V2_INIT_CODE_HASH);
    console.log("COMPUTED_V3_POOL_INIT_CODE_HASH:", COMPUTED_V3_INIT_CODE_HASH);

    const v2contract = await v2factory.deploy(signer.address);
    const v3contract = await v3factory.deploy();

    await v2contract.deployTransaction.wait();
    await v3contract.deployTransaction.wait();
    const v2hash = await v2contract.INIT_CODE_PAIR_HASH();
    const v3hash = await v3contract.POOL_INIT_CODE_HASH();

    console.log("V2 INIT_CODE_PAIR_HASH:", v2hash);
    console.log("V3 POOL_INIT_CODE_HASH:", v3hash);
  }
);

task("deploy", "deploy contract")
  .addParam("contract", "the contract name")
  .setAction(async ({ contract }, { ethers, run, network }) => {
    await run("compile");
    const signers = await ethers.getSigners();

    const contractInstant = await deployContract(
      contract,
      network.name,
      ethers.getContractFactory,
      signers[defaultAccount]
    );
  });

task("deployV2", "deploy V2 contracts")
  .addOptionalParam("weth9", "the WETH9 address")
  .setAction(async ({ weth9 }, { ethers, run, network }) => {
    await run("compile");
    const signer = (await ethers.getSigners())[defaultAccount];

    console.log("Signer", signer.address);
    console.log(
      "getBalance",
      (await ethers.provider.getBalance(signer.address)).toString()
    );

    console.log("Network On:", network.name);

    if (weth9 == undefined) {
      const WETH9 = await deployContract(
        "WETH9",
        network.name,
        ethers.getContractFactory,
        signer
      );

      if (allowVerifyChain.indexOf(network.name) > -1) {
        await run("verify:verify", {
          address: WETH9.address,
        });
      }
      weth9 = WETH9.address;
    }

    const UniswapV2Factory = await deployContract(
      "UniswapV2Factory",
      network.name,
      ethers.getContractFactory,
      signer,
      [signer.address]
    );

    const UniswapV2Router02 = await deployContract(
      "UniswapV2Router02",
      network.name,
      ethers.getContractFactory,
      signer,
      [UniswapV2Factory.address, weth9]
    );
  });

task("deployV3", "deploy V3 contracts")
  .addOptionalParam("weth9", "the WETH9 address")
  .setAction(async ({ weth9 }, { ethers, run, network }) => {
    await run("compile");
    const signer = (await ethers.getSigners())[defaultAccount];

    console.log("Signer", signer.address);
    console.log(
      "getBalance",
      (await ethers.provider.getBalance(signer.address)).toString()
    );

    if (weth9 == "") {
      const WETH9 = await deployContract(
        "WETH9",
        network.name,
        ethers.getContractFactory,
        signer
      );
      await run("verify:verify", { address: weth9 });
      weth9 = WETH9.address;
    }

    const UniswapV3Factory = await deployContract(
      "UniswapV3Factory",
      network.name,
      ethers.getContractFactory,
      signer
    );

    const TickLens = await deployContract(
      "TickLens",
      network.name,
      ethers.getContractFactory,
      signer
    );

    const Quoter = await deployContract(
      "Quoter",
      network.name,
      ethers.getContractFactory,
      signer,
      [UniswapV3Factory.address, weth9]
    );

    const SwapRouter = await deployContract(
      "SwapRouter",
      network.name,
      ethers.getContractFactory,
      signer,
      [UniswapV3Factory.address, weth9]
    );

    const NFTDescriptor = await deployContract(
      "contracts/NFTDescriptor/NFTDescriptor.sol:NFTDescriptor",
      network.name,
      ethers.getContractFactory,
      signer
    );

    const NonfungibleTokenPositionDescriptor = await deployContract(
      "NonfungibleTokenPositionDescriptor",
      network.name,
      ethers.getContractFactory,
      signer,
      [weth9,mainTokenName[network.name]],
      {
        "contracts/NonfungibleTokenPositionDescriptor/NFTDescriptor.sol:NFTDescriptor":
          NFTDescriptor.address,
      }
    );

    const ProxyAdmin = await deployContract(
      "contracts/ProxyAdmin/ProxyAdmin.sol:ProxyAdmin",
      network.name,
      ethers.getContractFactory,
      signer
    );

    const TransparentUpgradeableProxy = await deployContract(
      "contracts/TransparentUpgradeableProxy/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy",
      network.name,
      ethers.getContractFactory,
      signer,
      [NonfungibleTokenPositionDescriptor.address, ProxyAdmin.address, "0x"]
    );

    const NonfungiblePositionManager = await deployContract(
      "NonfungiblePositionManager",
      network.name,
      ethers.getContractFactory,
      signer,
      [UniswapV3Factory.address, weth9, TransparentUpgradeableProxy.address]
    );

    const V3Migrator = await deployContract(
      "V3Migrator",
      network.name,
      ethers.getContractFactory,
      signer,
      [UniswapV3Factory.address, weth9, NonfungiblePositionManager.address]
    );
  });

task("verifyV2", "verify V2 contracts")
  .addParam("weth9", "the WETH9 address")
  .setAction(async ({ weth9 }, { ethers, run, network }) => {
    if (allowVerifyChain.indexOf(network.name) > -1) {
      await run("verify:verify", getContract(network.name, "UniswapV2Factory"));
      await run(
        "verify:verify",
        getContract(network.name, "UniswapV2Router02")
      );
    }
  });
task("verifyV3", "verify V3 contracts")
  .addParam("weth9", "the WETH9 address")
  .setAction(async ({ weth9 }, { ethers, run, network }) => {
    if (allowVerifyChain.indexOf(network.name) > -1) {
      await run("verify:verify", getContract(network.name, "UniswapV3Factory"));
      await run("verify:verify", getContract(network.name, "TickLens"));
      await run("verify:verify", getContract(network.name, "Quoter"));
      await run("verify:verify", getContract(network.name, "SwapRouter"));
      await run("verify:verify", getContract(network.name, "NFTDescriptor"));
      await run(
        "verify:verify",
        getContract(network.name, "NonfungibleTokenPositionDescriptor")
      );
      await run("verify:verify", getContract(network.name, "ProxyAdmin"));
      await run(
        "verify:verify",
        getContract(network.name, "TransparentUpgradeableProxy")
      );
      await run(
        "verify:verify",
        getContract(network.name, "NonfungiblePositionManager")
      );
      await run("verify:verify", getContract(network.name, "V3Migrator"));
    }
  });
export default {
  networks: RPCS,
  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY,
  },
  solidity: {
    compilers: [compileSetting("0.7.6", 200)],
    overrides: {
      "contracts/WETH9/WETH9.sol": compileSetting("0.4.19", 200),
      "contracts/V2Core/Factory.sol": compileSetting("0.5.16", 999_999),
      "contracts/V2Core/Router02.sol": compileSetting("0.6.6", 999_999),
      "contracts/UniswapV3Factory/UniswapV3Factory.sol": compileSetting(
        "0.7.6",
        800
      ),
      "contracts/Multicall2/Multicall2.sol": compileSetting("0.8.2", 200),
      "contracts/ProxyAdmin/ProxyAdmin.sol": compileSetting("0.7.4", 200),
      "contracts/TickLens/TickLens.sol": compileSetting("0.7.6", 200),
      "contracts/TickLens/Quoter.sol": compileSetting("0.7.6", 1_000_000),
      "contracts/TickLens/SwapRouter.sol": compileSetting("0.7.6", 1_000_000),
      "contracts/NFTDescriptor/NFTDescriptor.sol": compileSetting("0.7.6", 200),
      "contracts/NonfungibleTokenPositionDescriptor/NonfungibleTokenPositionDescriptor.sol":
        compileSetting("0.7.6", 1_000),
      "contracts/TransparentUpgradeableProxy/TransparentUpgradeableProxy.sol":
        compileSetting("0.7.4", 200),
      "contracts/NonfungiblePositionManager/NonfungiblePositionManager.sol":
        compileSetting("0.7.6", 2_000),
      "contracts/V3Migrator/V3Migrator.sol": compileSetting("0.7.6", 1_000_000),
    },
  },
};
