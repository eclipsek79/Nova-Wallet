interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export function Skeleton({ className = '', rounded = 'rounded-xl' }: SkeletonProps) {
  return <div className={`skeleton ${rounded} ${className}`} />;
}
