import Skeleton from './Skeleton';

interface PanelSkeletonProps {
  height?: string;
}

export default function PanelSkeleton({ height = '200px' }: PanelSkeletonProps) {
  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
      {/* Title bar */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <Skeleton variant="circle" width="24px" height="24px" />
        <Skeleton variant="text" width="40%" />
      </div>
      {/* Content rows */}
      <div className="p-4 space-y-3" style={{ minHeight: height }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="65%" />
        <Skeleton variant="text" width="72%" />
      </div>
    </div>
  );
}
