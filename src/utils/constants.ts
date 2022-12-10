import packageJson from "../../package.json";
import getEnvConfig from "./getEnvConfig";

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? "mainnet";
export const MAINNET_API_URL = "https://api.lens.dev";
export const TESTNET_API_URL = "https://api-mumbai.lens.dev";
export const STAGING_API_URL =
  "https://staging-api-social-mumbai.lens.crtlkey.com";

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;

export const IS_MAINNET = API_URL === MAINNET_API_URL;
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001;

// Application
export const APP_NAME = "wagmifund";
export const APP_VERSION = packageJson.version;

// Messages
export const ERROR_MESSAGE = "Something went wrong!";
export const SIGN_WALLET = "Please sign in your wallet.";
export const WRONG_NETWORK = IS_MAINNET
  ? "Please change network to Polygon mainnet."
  : "Please change network to Polygon Mumbai testnet.";
export const SIGN_ERROR = "Failed to sign data";

// URLs
export const STATIC_ASSETS_URL = "https://assets.lenster.xyz";
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const POLYGONSCAN_URL = IS_MAINNET
  ? "https://polygonscan.com"
  : "https://mumbai.polygonscan.com";
export const ARWEAVE_GATEWAY = "https://arweave.net";
export const IPFS_GATEWAY = "https://lens.infura-ipfs.io/ipfs/";

// Errors
export const ERRORS = {
  notMined:
    "A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.",
};

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i;
export const HANDLE_REGEX = /^[\da-z]+$/;
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g;
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g;

export const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";

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
