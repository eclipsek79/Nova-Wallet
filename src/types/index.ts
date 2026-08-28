export type NetworkId = 'TON' | 'BTC' | 'ETH';
export type AssetId = 'GRAM' | 'USDT' | 'BTC' | 'ETH';
export type AssetType = 'native' | 'jetton' | 'simulated';

export interface Network {
  id: NetworkId;
  name: string;
  shortName: string;
  nativeAssetId: AssetId;
  isLive: boolean;
}

export interface Asset {
  id: AssetId;
  name: string;
  symbol: string;
  networkId: NetworkId;
  networkName: string;
  type: AssetType;
  decimals: number;
  isSimulated: boolean;
  color: string;
  priceUsd: number;
  change24h: number;
}

export interface Balance {
  assetId: AssetId;
  amount: number;
  usdValue: number;
}

export interface Wallet {
  id: string;
  address: string;
  label: string;
  createdAt: number;
  balances: Balance[];
}

export type TransactionDirection = 'in' | 'out' | 'swap';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type TransactionKind = 'send' | 'receive' | 'swap';

export interface Transaction {
  id: string;
  txHash: string;
  assetId: AssetId;
  assetSymbol: string;
  networkId: NetworkId;
  amount: number;
  usdValue: number;
  direction: TransactionDirection;
  kind: TransactionKind;
  status: TransactionStatus;
  timestamp: number;
  counterparty?: string;
  memo?: string;
  swapFrom?: AssetId;
  swapTo?: AssetId;
  swapFromAmount?: number;
  swapToAmount?: number;
  fee?: number;
  feeAsset?: AssetId;
}

export interface SwapQuote {
  fromAssetId: AssetId;
  toAssetId: AssetId;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  networkFee: number;
  feeAsset: AssetId;
  slippage: number;
  minReceived: number;
  priceImpact: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isPremium?: boolean;
  languageCode?: string;
}

export interface PortfolioSummary {
  totalUsd: number;
  change24hUsd: number;
  change24hPct: number;
}

export type Currency = 'USD' | 'EUR' | 'RUB';
export type Language = 'en' | 'ru';
export type ThemeMode = 'dark' | 'light' | 'system';
