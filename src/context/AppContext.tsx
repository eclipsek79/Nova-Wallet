import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Asset, Balance, Transaction, Wallet } from '@/types';
import { walletService } from '@/services/walletService';
import { transactionService } from '@/services/transactionService';
import { swapService } from '@/services/swapService';
import { marketService } from '@/services/marketService';
import type { PortfolioSummary } from '@/types';

interface AppContextValue {
  wallet: Wallet;
  assets: Asset[];
  balances: Balance[];
  transactions: Transaction[];
  portfolio: PortfolioSummary;
  refresh: () => void;
  sendTransaction: (params: {
    assetId: string;
    assetSymbol: string;
    networkId: string;
    amount: number;
    recipient: string;
    fee: number;
  }) => Transaction;
  executeSwap: (fromAssetId: string, toAssetId: string, fromAmount: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(() => walletService.getWallet());
  const [assets] = useState<Asset[]>(() => walletService.getAssets());
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    transactionService.getTransactions()
  );
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setWallet(walletService.getWallet());
    setTransactions(transactionService.getTransactions());
    setTick((t) => t + 1);
  }, []);

  // Poll for transaction status updates (simulated confirmations)
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(transactionService.getTransactions());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendTransaction = useCallback(
    (params: {
      assetId: string;
      assetSymbol: string;
      networkId: string;
      amount: number;
      recipient: string;
      fee: number;
    }) => {
      const tx = transactionService.sendTransaction(params);
      refresh();
      return tx;
    },
    [refresh]
  );

  const executeSwap = useCallback(
    (fromAssetId: string, toAssetId: string, fromAmount: number) => {
      const quote = swapService.getQuote(fromAssetId as never, toAssetId as never, fromAmount);
      if (!quote) return false;
      const balance = walletService.getBalance(fromAssetId);
      if (!balance || balance.amount < fromAmount + quote.networkFee) return false;
      transactionService.addSwapTransaction({
        fromAssetId,
        toAssetId,
        fromAmount,
        toAmount: quote.toAmount,
        fee: quote.networkFee,
      });
      refresh();
      return true;
    },
    [refresh]
  );

  const balances = useMemo(() => wallet.balances, [wallet, tick]);
  const portfolio = useMemo(() => marketService.getPortfolioSummary(wallet.balances), [wallet, tick]);

  const value: AppContextValue = {
    wallet,
    assets,
    balances,
    transactions,
    portfolio,
    refresh,
    sendTransaction,
    executeSwap,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
