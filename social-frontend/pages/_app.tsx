import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { ToastContextProvider } from '../components/Toast';
import { Contract } from '../context/Contract';
import { ThemeProvider } from '../context/Theme';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [polygonMumbai]
      : [hardhat]),
  ],
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
    ? [
        alchemyProvider({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
        }),
      ]
    : [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID as string;

const { connectors } = getDefaultWallets({
  appName: 'Social App',
  projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider>
          <ToastContextProvider>
            <Contract>
              <Component {...pageProps} />
            </Contract>
          </ToastContextProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
