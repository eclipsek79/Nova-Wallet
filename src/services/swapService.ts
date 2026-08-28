import type { AssetId, SwapQuote } from '@/types';
import { ASSETS, walletService } from './walletService';

const SLIPPAGE_DEFAULT = 0.5;
const TON_FEE = 0.05; // GRAM

function getAsset(id: string) {
  return ASSETS.find((a) => a.id === id);
}

function getQuote(fromAssetId: AssetId, toAssetId: AssetId, fromAmount: number): SwapQuote | null {
  const fromAsset = getAsset(fromAssetId);
  const toAsset = getAsset(toAssetId);
  if (!fromAsset || !toAsset) return null;
  if (fromAmount <= 0) return null;

  const fromUsd = fromAmount * fromAsset.priceUsd;
  const exchangeRate = fromAsset.priceUsd / toAsset.priceUsd;
  const toAmount = fromUsd / toAsset.priceUsd;
  const slippageMultiplier = 1 - SLIPPAGE_DEFAULT / 100;
  const minReceived = toAmount * slippageMultiplier;
  const priceImpact = Math.max(0, (SLIPPAGE_DEFAULT / 100) * (fromAmount / 1000));

  return {
    fromAssetId,
    toAssetId,
    fromAmount,
    toAmount,
    exchangeRate,
    networkFee: TON_FEE,
    feeAsset: 'GRAM',
    slippage: SLIPPAGE_DEFAULT,
    minReceived,
    priceImpact,
  };
}

function executeSwap(fromAssetId: AssetId, toAssetId: AssetId, fromAmount: number): SwapQuote | null {
  const quote = getQuote(fromAssetId, toAssetId, fromAmount);
  if (!quote) return null;

  const balance = walletService.getBalance(fromAssetId);
  if (!balance || balance.amount < fromAmount + TON_FEE) return null;

  return quote;
}

function getSupportedPairs(): { from: AssetId; to: AssetId }[] {
  return [
    { from: 'GRAM', to: 'USDT' },
    { from: 'USDT', to: 'GRAM' },
    { from: 'GRAM', to: 'BTC' },
    { from: 'GRAM', to: 'ETH' },
  ];
}

export const swapService = {
  getQuote,
  executeSwap,
  getSupportedPairs,
};
