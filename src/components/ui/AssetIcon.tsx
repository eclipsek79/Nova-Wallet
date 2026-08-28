import type { Asset } from '@/types';

interface AssetIconProps {
  asset: Pick<Asset, 'symbol' | 'color'>;
  size?: number;
}

export function AssetIcon({ asset, size = 40 }: AssetIconProps) {
  const letter = asset.symbol.charAt(0);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${asset.color}, ${asset.color}cc)`,
        fontSize: size * 0.42,
      }}
    >
      {letter}
    </div>
  );
}
