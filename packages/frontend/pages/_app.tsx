import * as React from "react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import "../styles/globals.css";
import { Layout } from "@/components";

// Imports
import { createClient, WagmiConfig, configureChains } from "wagmi";
import {
  mainnet,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum,
  hardhat,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { useIsMounted } from "../hooks";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, polygonMumbai, optimism, arbitrum, hardhat],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "create-web3",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains}>
        <Layout>
          <NextHead>
            <title>vykt</title>
          </NextHead>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
