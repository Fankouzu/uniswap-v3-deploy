# Uniswap V3 智能合约一键部署,源代码一键开源验证工具包

- ### [Uniswap V3原版的部署信息](./uniswap.md)
- ### [Uniswap V3 线上DEMO](https://fankouzu.github.io/v3swap/)
## 安装
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
## 部署Uniswap V2
- 如果只需要部署UniswapV3则可以跳过这一步,但是如果你未来想要部署Uniswap的interface前端,则必须依赖一套UniswapV2的合约才可以运行前端,你也可以让你的前端链接现有的UniswapV2合约,这样也可以跳过这一步

1. 部署Uniswap V2合约
- 部署UniswapV2合约需要依赖一个WETH9合约,一般情况下一个正式链(例如以太坊主网,或币安智能链)都有一个全链通用的WETH9合约,你需要找到这个合约的地址并作为参数用在部署命令上;
- 你也可以部署一套自己的WETH9合约,如果你的链上没有通用的WETH9合约,参数中不带有--weth9,就会部署脚本就会自动部署一套你自己的WETH9合约;
```
npx hardhat deployV2 --weth9 {0x....WETH合约地址} --network {网络名称缩写}
```
- 例如将合约部署到币安智能链主网(bscmain),指定weth合约地址为0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c 命令如下:
```
npx hardhat deployV2 --weth9 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c --network bscmain
```
- 如果需要部署自己的WETH9合约
```
npx hardhat deployV2 --network {网络名称缩写}
```

## 部署Uniswap V3
1. 部署uniswap v3合约
- UniswapV3同样依赖一套WETH9合约
```
npx hardhat deployV3 --weth9 {0x....WETH合约地址} --network {网络名称缩写}
```
- 如果需要部署自己的WETH9合约
```
npx hardhat deployV3 --network {网络名称缩写}
```
## 部署multicall2合约 V3
- `[可选操作]`如果你在未来需要部署Uniswap的前端,则需要依赖一套Multicall2合约,如果你所在的链上已经存在Multicall2合约,则你只需要找到地址即可,在前端配置上Multicall2的地址,Multicall2合约是通用的,如果已经存在就不需要部署自己的合约了;
``` 
npx hardhat deploy --contract Multicall2 --network {网络名称缩写}
```
## 验证合约
1. 验证uniswap V2合约
- 不是所有的链的浏览器都支持合约开源验证的
```
npx hardhat verifyV2 --weth9 {0x....WETH合约地址} --network {网络名称缩写}
```
2. 验证uniswap V3合约
```
npx hardhat verifyV3 --weth9 {0x....WETH合约地址} --network {网络名称缩写}
```
3. 验证multicall2合约[可选]
```
npx hardhat verify {0x....Multicall2合约地址} --network {网络名称缩写}
```
## 支持的网络
- 你可以通过修改[network.ts](./script/network.ts)文件来增加支持的网络,在这个文件里已经预设了一些网络的RPC地址和一些所需的参数,更得的链信息参阅[https://chainlist.org/](https://chainlist.org/)
- 只有支持合约验证的链才可以通过上面的命令行对合约进行验证,其他不支持的链有的也许可以通过浏览器上传代码方法进行验证,但是也有的链因为浏览器功能局限,导致无法验证合约

| 网络名称           | chainId | 缩写(用在命令参数中) | 支持合约验证 |
| ----------------- | ------- | ----------------- | ----- |
| hardhat本地测试环境 |    *    |           hardhat |       |
| Ropsten |    3    |           ropsten |   *    |
| Rinkeby |    4    |           rinkeby |   *    |
| Görli |    5    |           goerli |   *    |
| Kovan |    42    |           kovan |   *    |
| Binance Smart Chain Testnet |    97    |           bsctest |    *   |
| Binance Smart Chain Mainnet |    56    |           bscmain |   *    |
| Huobi ECO Chain Testnet |    256    |           hecotest |   *    |
| Huobi ECO Chain Mainnet |    128    |           hecomain |    *   |
| Meter Testnet |    101    |           mtrtest |       |
| Meter Mainnet |    82    |           mtrmain |       |
| Clover Testnet |    1023    |           clvtest |       |
| Clover Mainnet |    1024    |           clvmain |       |
| Haic |    17843    |           haicmain |       |
| Galt |    17845    |           galtmain |       |
| CoinEx Smart Chain Testnet |    53    |           coinextest |       |
| CoinEx Smart Chain Mainnet |    52    |           coinexmain |       |
| Matic(Polygon) |    137    |           maticmain |    *   |
| Matic Testnet Mumbai |    80001    |           matictest |   *    |
| Fantom Opera Testnet |    4002    |           ftmtest |       |
| Fantom Opera Mainnet |    250    |           ftmmain |    *   |
| HOO Smart Chain Testnet |    170    |           hootest |       |
| HOO Smart Chain Mainnet |    70    |           hoomain |       |
| OKExChain Testnet |    65    |           oktest |       |
| OKExChain Mainnet |    66    |           okmain |       |
| xDAI Chain |    100    |           xdai |       |
| Harmony Mainnet |    1666600000    |           harmonymain |       |
| Harmony Testnet |    1666700000    |           harmonytest |       |
| Avalanche Fuji Testnet |    43113    |           avaxtest |       |
| Avalanche Mainnet |    43114    |           avaxmain |       |
| Celo Alfajores Testnet |    44787    |           celotest |       |
| Celo Mainnet |    42220    |           celomain |       |
| Moonbeam Testnet |    1287    |           moonbeamtest |       |

## 其它工具
- 获取助记词对应的账户在指定的链上主币余额
```
npx hardhat accounts --network {网络名称缩写}
```
- 获取并验证INIT_CODE_HASH
    - 通过这个命令可以验证V2合约中的`INIT_CODE_PAIR_HASH`和V3合约中的`POOL_INIT_CODE_HASH`
    - 这个脚本首先会通过计算源代码的方法计算出对应的两个hash,之后会模拟部署合约,并从合约中读取两个hash,如果你发现两对hash都是对应的,则正确,如果不对应,则有错误
```
npx hardhat getHash
```