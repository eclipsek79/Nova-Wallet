import type { Asset, PortfolioSummary } from '@/types';
import { ASSETS } from './walletService';

function getMarketData(): Asset[] {
  return ASSETS.map((a) => ({ ...a }));
}

function getPortfolioSummary(balances: { assetId: string; amount: number }[]): PortfolioSummary {
  let totalUsd = 0;
  let prevUsd = 0;
  for (const b of balances) {
    const asset = ASSETS.find((a) => a.id === b.assetId);
    if (!asset) continue;
    const usd = b.amount * asset.priceUsd;
    totalUsd += usd;
    prevUsd += usd / (1 + asset.change24h / 100);
  }
  const change24hUsd = totalUsd - prevUsd;
  const change24hPct = prevUsd > 0 ? (change24hUsd / prevUsd) * 100 : 0;
  return { totalUsd, change24hUsd, change24hPct };
}

function formatUsd(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAmount(value: number, decimals = 4): string {
  if (value === 0) return '0';
  if (value < 0.01) return value.toFixed(decimals);
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

function formatPrice(value: number): string {
  if (value >= 1000) return formatUsd(value);
  return '$' + value.toFixed(value < 1 ? 4 : 2);
}

function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const marketService = {
  getMarketData,
  getPortfolioSummary,
  formatUsd,
  formatAmount,
  formatPrice,
  formatPct,
  formatTimeAgo,
  formatDate,
};
