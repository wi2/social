import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { ToastContextProvider } from '../components/Toast';
import { Contract } from '../context/Contract';
import { ThemeProvider } from '../context/Theme';
import { wagmiConfig } from '../constants/contract';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <ToastContextProvider>
              <Contract>
                <Component {...pageProps} />
              </Contract>
            </ToastContextProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
