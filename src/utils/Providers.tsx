import { ApolloProvider } from "@apollo/client";
import type { ReactNode } from "react";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { RPC_URL } from "@utils/constants";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import client from "@utils/apollo";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: RPC_URL,
      }),
    }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      // coinbaseWallet({ appName: APP_NAME, chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <RainbowKitProvider modalSize="compact" chains={chains}>
      {children}
    </RainbowKitProvider>
  );
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProviderWrapper>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </RainbowKitProviderWrapper>
    </WagmiConfig>
  );
};

export default Providers;
