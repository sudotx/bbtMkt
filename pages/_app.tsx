import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {} from "@rainbow-me/rainbowkit/wallets";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { DataProvider } from "../contexts/DataContext";
import "../styles/globals.css";

const { chains, provider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [
    alchemyProvider({ apiKey: "WAyM5IvShlE1WIlyZFS2BmyE0eEvFK06" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
export default MyApp;
