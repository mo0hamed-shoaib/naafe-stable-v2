import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style} />
);

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 6 }) => (
  <div className="bg-light-cream rounded-2xl shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-warm-cream border-b border-light-cream">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-4 text-right">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-light-cream">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton className="h-4 w-full max-w-32" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface CardSkeletonProps {
  cards?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ cards = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="bg-light-cream rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

interface ChartSkeletonProps {
  height?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 'h-64' }) => (
  <div className={`bg-light-cream rounded-2xl p-6 shadow-md ${height}`}>
    <Skeleton className="h-6 w-32 mb-4" />
    <div className="flex items-end justify-between h-48">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton 
          key={index} 
          className="w-8 bg-gray-300" 
          style={{ height: `${Math.random() * 100 + 50}%` }}
        />
      ))}
    </div>
  </div>
);

export default Skeleton; 