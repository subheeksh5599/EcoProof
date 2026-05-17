declare module '@solana/wallet-adapter-react' {
  import { FC, ReactNode } from 'react';
  import { WalletAdapter } from '@solana/wallet-adapter-base';

  export interface ConnectionProviderProps {
    endpoint: string;
    config?: any;
    children: ReactNode;
  }

  export interface WalletProviderProps {
    wallets: WalletAdapter[];
    autoConnect?: boolean;
    children: ReactNode;
  }

  export const ConnectionProvider: FC<ConnectionProviderProps>;
  export const WalletProvider: FC<WalletProviderProps>;
  export function useConnection(): any;
  export function useWallet(): any;
}

declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode } from 'react';

  export interface WalletModalProviderProps {
    children: ReactNode;
  }

  export const WalletModalProvider: FC<WalletModalProviderProps>;
  export const WalletMultiButton: FC<any>;
  export const WalletDisconnectButton: FC<any>;
}
