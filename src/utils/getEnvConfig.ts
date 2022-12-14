import {
  LENS_NETWORK,
  MAINNET_API_URL,
  STAGING_API_URL,
  TESTNET_API_URL,
} from "./constants";
import {
  MAINNET_DEFAULT_TOKEN,
  MAINNET_LENS_PERIPHERY,
  MAINNET_LENSHUB_PROXY,
  MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
  TESTNET_DEFAULT_TOKEN,
  TESTNET_LENS_PERIPHERY,
  TESTNET_LENSHUB_PROXY,
  TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
} from "./contracts";

const getEnvConfig = () => {
  switch (LENS_NETWORK) {
    case "mainnet":
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress:
          MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
      };
    case "testnet":
      return {
        apiEndpoint: TESTNET_API_URL,
        lensHubProxyAddress: TESTNET_LENSHUB_PROXY,
        lensPeripheryAddress: TESTNET_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress:
          TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
      };
    case "staging":
      return {
        apiEndpoint: STAGING_API_URL,
        lensHubProxyAddress: TESTNET_LENSHUB_PROXY,
        lensPeripheryAddress: TESTNET_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress:
          TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
      };
    default:
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress:
          MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
      };
  }
};

export default getEnvConfig;
