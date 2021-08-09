# Uniswap V3 智能合约一键部署


- ## 以下为Uniswap V3原版的部署信息
最新版本的`@uniswap/v3-core`、`@uniswap/v3-periphery` 部署到以太坊主网和所有测试网的相同地址。

源代码在所有网络上都通过 Etherscan 验证，适用于除“UniswapV3Pool”之外的所有合约。

我们正在努力通过 Etherscan 验证“UniswapV3Pool”合约

这些地址是最终地址，是从这些 npm 包版本部署的：
- `@uniswap/v3-core`: [`1.0.0`](https://github.com/Uniswap/uniswap-v3-core/tree/v1.0.0)
- `@uniswap/v3-periphery`: [`1.0.0`](https://github.com/Uniswap/uniswap-v3-periphery/tree/v1.0.0)

| Contract                           | Address                                      | Source Code                                                                                                                   |
| ---------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| UniswapV3Factory                   | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | https://github.com/Uniswap/uniswap-v3-core/blob/v1.0.0/contracts/UniswapV3Factory.sol                                         |
| Multicall2                         | `0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696` | https://etherscan.io/address/0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696#code                                                  |
| ProxyAdmin                         | `0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2` | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.1-solc-0.7-2/contracts/proxy/ProxyAdmin.sol                  |
| TickLens                           | `0xbfd8137f7d1516D3ea5cA83523914859ec47F573` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/lens/TickLens.sol                                       |
| Quoter                             | `0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/lens/Quoter.sol                                         |
| SwapRouter                         | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/SwapRouter.sol                                          |
| NFTDescriptor                      | `0x42B24A95702b9986e82d421cC3568932790A48Ec` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/libraries/NFTDescriptor.sol                             |
| NonfungibleTokenPositionDescriptor | `0x91ae842A5Ffd8d12023116943e72A606179294f3` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/NonfungibleTokenPositionDescriptor.sol                  |
| TransparentUpgradeableProxy        | `0xEe6A57eC80ea46401049E92587E52f5Ec1c24785` | https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.4.1-solc-0.7-2/contracts/proxy/TransparentUpgradeableProxy.sol |
| NonfungiblePositionManager         | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/NonfungiblePositionManager.sol                          |
| V3Migrator                         | `0xA5644E29708357803b5A882D272c41cC0dF92B34` | https://github.com/Uniswap/uniswap-v3-periphery/blob/v1.0.0/contracts/V3Migrator.sol                                          |

## Uniswap V3 智能合约一键部署安装使用方法

1. 克隆
```
git clone https://github.com/Fankouzu/uniswap-v3-deploy.git
```
2. 安装依赖
```
cd uniswap-v3-deploy
npm install
```
3. 配置.env
```
mv .env.sample .env
vim .env
```
```
MNEMONIC='输入助记词'
INFURA_API_KEY='输入infura key'
ETHERSCAN_APIKEY='输入etherscan api key'
```
4. 编译合约
```
npm run compile
```
5. 部署uniswap V2合约
```
npx hardhat deployV2 --weth9 {0x....WETH合约地址} --network {网络名称}
```
- 例如将合约部署到币安智能链主网(bscmain),指定weth合约地址为0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c 命令如下:
```
npx hardhat deployV2 --weth9 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c --network bscmain
```
6. 部署uniswap v3合约
```
npx hardhat deployV3 --weth9 {0x....WETH合约地址} --network {网络名称}
```
7. 部署multicall2合约[可选]
```
npx hardhat deploy --contract Multicall2 --network {网络名称}
```
8. 验证uniswap V2合约
```
npx hardhat verifyV2 --weth9 {0x....WETH合约地址} --network {网络名称}
```
9. 验证uniswap V3合约
```
npx hardhat verifyV3 --weth9 {0x....WETH合约地址} --network {网络名称}
```
10. 验证multicall2合约[可选]
```
npx hardhat verify {0x....Multicall2合约地址} --network {网络名称}
```
