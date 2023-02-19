import type { AppProps } from "next/app";
import NextHead from "next/head";

import { Layout } from "@/components";
import "../styles/globals.css";

import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { useIsMounted } from "../hooks";

const mantleTestnet: Chain = {
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BIT",
    symbol: "BIT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz/"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://explorer.testnet.mantle.xyz/",
    },
  },
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [mantleTestnet],
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
            <title>Vykt</title>
          </NextHead>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
