import packageJson from "../../package.json";
import getEnvConfig from "./getEnvConfig";

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? "mainnet";
export const MAINNET_API_URL = "https://api.lens.dev";
export const TESTNET_API_URL = "https://api-mumbai.lens.dev";

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const FREE_COLLECT_MODULE = getEnvConfig().freeCollectModuleAddress;

export const IS_MAINNET = API_URL === MAINNET_API_URL;
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const RELAY_ON = "false";

// Application
export const APP_NAME = "wagmifund";
export const DESCRIPTION =
  "Fueling the decentralized future with web3 funding 💰";
export const APP_VERSION = packageJson.version;

// Bundlr
export const BUNDLR_CURRENCY = "matic";
export const BUNDLR_NODE_URL = "https://node2.bundlr.network";

// Messages
export const ERROR_MESSAGE = "Something went wrong!";
export const SIGN_WALLET = "Please sign in your wallet.";
export const WRONG_NETWORK = IS_MAINNET
  ? "Please change network to Polygon mainnet."
  : "Please change network to Polygon Mumbai testnet.";
export const SIGN_ERROR = "Failed to sign data";
export const LENSPROTOCOL_HANDLE = "lensprotocol";
export const HANDLE_SUFFIX = IS_MAINNET ? ".lens" : ".test";
export const SERVERLESS_URL = "http://localhost:3000/api";

// URLs
export const POLYGONSCAN_URL = IS_MAINNET
  ? "https://polygonscan.com"
  : "https://mumbai.polygonscan.com";
export const ARWEAVE_GATEWAY = "https://arweave.net";
export const IPFS_GATEWAY = "https://lens.infura-ipfs.io/ipfs/";
export const EVER_API = "https://endpoint.4everland.co";
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
  : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
// Errors
export const ERRORS = {
  notMined:
    "A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.",
};

export const IMGPROXY_URL = "https://ik.imagekit.io/wagmifund";

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i;
export const HANDLE_REGEX = /^[\da-z]+$/;
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g;
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g;

export const RPC_URL = IS_MAINNET
  ? "https://rpc.ankr.com/polygon"
  : "https://rpc.ankr.com/polygon_mumbai";

// Utils
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Localstorage keys
export const WF_KEYS = {
  WAGMI_FUND_STORE: "wagmifund.store",
  TRANSACTION_STORE: "transaction.store",
  TIMELINE_STORE: "timeline.store",
  MESSAGE_STORE: "message.store",
};

export const SUPPORTED_CURRENCIES = IS_MAINNET
  ? [
      {
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18,
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        typename: "Erc20",
      },
      {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        typename: "Erc20",
      },
      {
        name: "USD Coin (PoS)",
        symbol: "USDC",
        decimals: 6,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        typename: "Erc20",
      },
      {
        name: "(PoS) Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        typename: "Erc20",
      },
      {
        name: "Toucan Protocol: Nature Carbon Tonne",
        symbol: "NCT",
        decimals: 18,
        address: "0xD838290e877E0188a4A44700463419ED96c16107",
        __typename: "Erc20",
      },
    ]
  : [
      {
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18,
        address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        typename: "Erc20",
      },
      {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        address: "0x3C68CE8504087f89c640D02d133646d98e64ddd9",
        typename: "Erc20",
      },
      {
        name: "USD Coin (PoS)",
        symbol: "USDC",
        decimals: 6,
        address: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
        typename: "Erc20",
      },
      {
        name: "(PoS) Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
        address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
        typename: "Erc20",
      },
      {
        name: "Toucan Protocol: Nature Carbon Tonne",
        symbol: "NCT",
        decimals: 18,
        address: "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E",
        __typename: "Erc20",
      },
    ];

// export const SUPPORTED_CURRENCIES = [
//   {
//     name: "Wrapped Matic",
//     symbol: "WMATIC",
//     decimals: 18,
//     address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
//     typename: "Erc20",
//   },
//   {
//     name: "Wrapped Ether",
//     symbol: "WETH",
//     decimals: 18,
//     address: "0x3C68CE8504087f89c640D02d133646d98e64ddd9",
//     typename: "Erc20",
//   },
//   {
//     name: "USD Coin (PoS)",
//     symbol: "USDC",
//     decimals: 6,
//     address: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
//     typename: "Erc20",
//   },
//   {
//     name: "(PoS) Dai Stablecoin",
//     symbol: "DAI",
//     decimals: 18,
//     address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
//     typename: "Erc20",
//   },
//   {
//     name: "Toucan Protocol: Nature Carbon Tonne",
//     symbol: "NCT",
//     decimals: 18,
//     address: "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E",
//     __typename: "Erc20",
//   },
// ];
